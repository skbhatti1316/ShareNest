/**
 * Comprehensive End-to-End Workflow & Concurrency Test
 * Tests the entire lifecycle of User A (Owner) and User B (Borrower)
 */

const BASE_URL = "http://localhost:5000/api";

async function runTests() {
  console.log("=== STARTING SHARENEST WORKFLOW & CONCURRENCY TESTS ===");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthJson = await healthRes.json();
    assert(healthRes.status === 200 && healthJson.status === "ok", "1. Health check returns status 200 and 'ok'");

    // 2. Login User A (Alex Rivera - Owner)
    const loginARes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "alex@example.com", password: "Password123!" }),
    });
    const loginA = await loginARes.json();
    assert(loginARes.status === 200 && loginA.token, "2. User A (Alex Rivera) logs in successfully and receives JWT token");
    const tokenA = loginA.token;
    const userA = loginA.user;

    // 3. Login User B (Jordan Lee - Borrower)
    const loginBRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "jordan@example.com", password: "Password123!" }),
    });
    const loginB = await loginBRes.json();
    assert(loginBRes.status === 200 && loginB.token, "3. User B (Jordan Lee) logs in successfully and receives JWT token");
    const tokenB = loginB.token;
    const userB = loginB.user;

    // 4. Verify /auth/me for persistence
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const meJson = await meRes.json();
    assert(meRes.status === 200 && meJson.user.email === "jordan@example.com", "4. GET /api/auth/me correctly returns authenticated session user");

    // 5. User B finds User A's projector
    const itemsRes = await fetch(`${BASE_URL}/items?search=projector`);
    const itemsJson = await itemsRes.json();
    const projector = itemsJson.items.find((i: any) => i.name.toLowerCase().includes("projector"));
    assert(Boolean(projector && projector.available), "5. User B searches and finds User A's projector listed as available");

    // 6. Test borrower cannot request their own item
    const selfBorrowRes = await fetch(`${BASE_URL}/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`, // Owner requesting own item
      },
      body: JSON.stringify({
        itemId: projector._id,
        startDate: "2026-11-01",
        endDate: "2026-11-03",
        note: "Trying to borrow my own item",
      }),
    });
    const selfBorrowJson = await selfBorrowRes.json();
    assert(selfBorrowRes.status === 400 && !selfBorrowJson.success, "6. Server rejects owner borrowing their own item");

    // 7. Test invalid dates (return earlier than start)
    const invalidDateRes = await fetch(`${BASE_URL}/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenB}`,
      },
      body: JSON.stringify({
        itemId: projector._id,
        startDate: "2026-11-05",
        endDate: "2026-11-02", // Before start!
        note: "Invalid date test",
      }),
    });
    assert(invalidDateRes.status === 400, "7. Server rejects borrow request with return date earlier than start date");

    // 8. User B submits valid borrow request for Projector
    const createReqRes = await fetch(`${BASE_URL}/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenB}`,
      },
      body: JSON.stringify({
        itemId: projector._id,
        startDate: "2026-11-10",
        endDate: "2026-11-12",
        note: "Hosting a community documentary night!",
      }),
    });
    const createReqJson = await createReqRes.json();
    assert(createReqRes.status === 201 && createReqJson.request.status === "Pending", "8. User B successfully submits request; saved in MongoDB with status 'Pending'");
    const requestId = createReqJson.request._id;

    // 9. Duplicate active request protection
    const dupRes = await fetch(`${BASE_URL}/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenB}`,
      },
      body: JSON.stringify({
        itemId: projector._id,
        startDate: "2026-11-10",
        endDate: "2026-11-12",
      }),
    });
    assert(dupRes.status === 400, "9. Duplicate active request by same user for same item is blocked");

    // 10. Check User A received persistent notification in MongoDB
    const notifARes = await fetch(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const notifAJson = await notifARes.json();
    const reqNotif = notifAJson.notifications.find((n: any) => n.requestId && (n.requestId._id === requestId || n.requestId === requestId));
    assert(Boolean(reqNotif && notifAJson.unreadCount > 0), "10. User A (Owner) has persistent notification in MongoDB for the request");

    // 11. Unauthorized user cannot approve request
    const unauthApproveRes = await fetch(`${BASE_URL}/requests/${requestId}/approve`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${tokenB}` }, // Borrower trying to approve own request
    });
    assert(unauthApproveRes.status === 403, "11. Unauthorized user (borrower) blocked from approving request");

    // 12. User A (Owner) approves the request
    const approveRes = await fetch(`${BASE_URL}/requests/${requestId}/approve`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const approveJson = await approveRes.json();
    assert(approveRes.status === 200 && approveJson.request.status === "Approved", "12. User A approves request; status updated to 'Approved' in MongoDB");

    // 13. Concurrency check: overlapping approved request cannot occur
    // Create another user C and try to request same dates
    const registerC = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Charlie Davis",
        email: `charlie_${Date.now()}@example.com`,
        password: "Password123!",
        community: "Sunrise Heights",
      }),
    });
    const userCJson = await registerC.json();
    const tokenC = userCJson.token;

    const reqCRes = await fetch(`${BASE_URL}/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenC}`,
      },
      body: JSON.stringify({
        itemId: projector._id,
        startDate: "2026-11-11", // Overlaps with Nov 10-12
        endDate: "2026-11-13",
        note: "Overlapping request",
      }),
    });
    const reqCJson = await reqCRes.json();
    const reqCId = reqCJson.request._id;

    // Trying to approve reqC should fail due to date overlap!
    const conflictApproveRes = await fetch(`${BASE_URL}/requests/${reqCId}/approve`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(conflictApproveRes.status === 400, "13. Concurrency protection blocks approving overlapping booking for same item");

    // 14. Check User B received notification that request was approved
    const notifBRes = await fetch(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const notifBJson = await notifBRes.json();
    const approvedNotif = notifBJson.notifications.find((n: any) => n.type === "request_approved");
    assert(Boolean(approvedNotif), "14. User B receives persistent approval notification");

    // 15. User A marks item Ready for Pickup
    const readyRes = await fetch(`${BASE_URL}/requests/${requestId}/ready-pickup`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const readyJson = await readyRes.json();
    assert(readyRes.status === 200 && readyJson.request.status === "Ready for Pickup", "15. Owner marks item 'Ready for Pickup'");

    // 16. Handover confirmed -> status 'Borrowed', item marked unavailable
    const handoverRes = await fetch(`${BASE_URL}/requests/${requestId}/handover`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const handoverJson = await handoverRes.json();
    assert(handoverRes.status === 200 && handoverJson.request.status === "Borrowed", "16. Handover confirmed; status updated to 'Borrowed'");

    // Verify item is now unavailable
    const updatedProjRes = await fetch(`${BASE_URL}/items/${projector._id}`);
    const updatedProj = await updatedProjRes.json();
    assert(updatedProj.item.available === false, "17. Item availability is set to false during active loan");

    // 18. Borrower requests return
    const returnReqRes = await fetch(`${BASE_URL}/requests/${requestId}/return-request`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const returnReqJson = await returnReqRes.json();
    assert(returnReqRes.status === 200 && returnReqJson.request.status === "Return Requested", "18. Borrower requests return; status updated to 'Return Requested'");

    // 19. Owner confirms return -> status 'Returned', item marked available again!
    const returnConfirmRes = await fetch(`${BASE_URL}/requests/${requestId}/confirm-return`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const returnConfirmJson = await returnConfirmRes.json();
    assert(returnConfirmRes.status === 200 && returnConfirmJson.request.status === "Returned", "19. Owner confirms return; status updated to 'Returned'");

    const returnedProjRes = await fetch(`${BASE_URL}/items/${projector._id}`);
    const returnedProj = await returnedProjRes.json();
    assert(returnedProj.item.available === true, "20. Item availability is restored to true after return");

    // 21. User B leaves review for the item
    const reviewRes = await fetch(`${BASE_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenB}`,
      },
      body: JSON.stringify({
        itemId: projector._id,
        rating: 5,
        comment: "Flawless experience! The projector made our movie night spectacular.",
        requestId,
      }),
    });
    const reviewJson = await reviewRes.json();
    assert(reviewRes.status === 201 && reviewJson.itemRating >= 4.8, "21. Borrower posts review; item rating and review count recalculate");

    // 22. In-app Chat / message between User A and User B
    const chatMsgRes = await fetch(`${BASE_URL}/requests/${requestId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenB}`,
      },
      body: JSON.stringify({
        text: "Thanks again Alex, returning the HDMI cable too!",
      }),
    });
    const chatMsgJson = await chatMsgRes.json();
    assert(chatMsgRes.status === 201 && chatMsgJson.message.text.includes("HDMI cable"), "22. Internal request coordination message saved and delivered");

    console.log(`\n=== TEST SUITE COMPLETED: ${passed} PASSED, ${failed} FAILED ===\n`);
    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test execution encountered an error:", err);
    process.exit(1);
  }
}

runTests();
