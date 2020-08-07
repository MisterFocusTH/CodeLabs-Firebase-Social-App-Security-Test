/*jshint esversion: 8 */

const assert = require("assert");
const firebase = require("@firebase/testing");

const MY_PROJECT_ID = "codelabs-firebase-social-app";

// Optional
const myID = "user_abc";
const theirId = "user_xyz";
const myAuthObject = {uid: myID, email: "abc@gmail.com"};

function getFirestore(auth) {
    return firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: auth}).firestore();
}

function getAdminFirestore() {
    return firebase.initializeAdminApp({projectId: MY_PROJECT_ID}).firestore();
}

beforeEach(async() => {
    await firebase.clearFirestoreData({projectId: MY_PROJECT_ID});
});

describe("Our Social App", () => {

    it("Understands Basic Condition", () => {
        assert.equal(2+2, 4);
    });

    it("Can Read Items In The Read-Only Collections", async () => {
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID}).firestore();
        const testDoc = db.collection("read_only").doc("test_doc");
        await firebase.assertSucceeds(testDoc.get());
    });

    it("Can't Write Items In The Read-Only Collections", async () => {
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID}).firestore();
        const testDoc = db.collection("read_only").doc("test_write_doc");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Write To A User Document With The Same ID As Our User", async () => {
        const myAuthObject = {uid: "user_abc", email: "abc@gmail.com"};
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: myAuthObject}).firestore();
        const testDoc = db.collection("user").doc("user_abc");
        await firebase.assertSucceeds(testDoc.set({foo: "bar"}));
    });

    it("Can't Write To A User Document With A Different ID As Our User", async () => {
        const myAuthObject = {uid: "user_abc", email: "abc@gmail.com"};
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: myAuthObject}).firestore();
        const testDoc = db.collection("user").doc("user_xyc");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Read Posts That Marked As Public", async () => {
        const db = getFirestore(null);
        const testQuery = db.collection("posts").where("visibility", "==", "public");
        await firebase.assertSucceeds(testQuery.get());
    });

    it("Can Query My Personal Posts", async () => {
        const db = getFirestore(myAuthObject);
        const testQuery = db.collection("posts").where("authorId", "==", myID);
        await firebase.assertSucceeds(testQuery.get());
    });

    it("Can't Query All Posts", async () => {
        const db = getFirestore(myAuthObject);
        const testQuery = db.collection("posts");
        await firebase.assertFails(testQuery.get());
    });

    // Optional - Use With getAdminFirestore()
    it("Admin Can Write A Public Post And Then Can Read A Single Post As Annonymouse User", async () => {
        const admin = getAdminFirestore();
        const postId = "public_post";
        const setupDoc = admin.collection("posts").doc(postId);
        await setupDoc.set({authorId: theirId, visibility: "public"});

        const db = getFirestore(null);
        const testRead = db.collection("posts").doc(postId);
        await firebase.assertSucceeds(testRead.get());
    });

    it("Can Read A Private Post That Belonging To The User", async () => {
        const admin = getAdminFirestore();
        const postId = "private_post";
        const setupDoc = admin.collection("posts").doc(postId);
        await setupDoc.set({authorId: myID, visibility: "public"});

        const db = getFirestore(myAuthObject);
        const testRead = db.collection("posts").doc(postId);
        await firebase.assertSucceeds(testRead.get());
    });

    it("Can't Read A Private Post That Belonging To Another User", async () => {
        const admin = getAdminFirestore();
        const postId = "private_post";
        const setupDoc = admin.collection("posts").doc(postId);
        await setupDoc.set({authorId: theirId, visibility: "private"});

        const db = getFirestore(myAuthObject);
        const testRead = db.collection("posts").doc(postId);
        await firebase.assertFails(testRead.get());
    });


    // Optional - Use With getFirestore()
    it("Can't Write Items In The Read-Only Collections - With getFirestore()", async () => {
        const db = getFirestore(myAuthObject);
        const testDoc = db.collection("read_only").doc("test_write_doc");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Write To A User Document With The Same ID As Our User - With getFirestore()", async () => {
        const myAuthObject = {uid: "user_abc", email: "abc@gmail.com"};
        const db = getFirestore(myAuthObject);
        const testDoc = db.collection("user").doc(myID);
        await firebase.assertSucceeds(testDoc.set({foo: "bar"}));
    });

    it("Can't Write To A User Document With A Different ID As Our User - With getFirestore()", async () => {
        const db = getFirestore(myAuthObject);
        const testDoc = db.collection("user").doc(theirId);
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });


    // Delete It After Tested

    it("Can Read Items In The Read-Only Collections", async () => {
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID}).firestore();
        const testDoc = db.collection("read_only").doc("test_doc");
        await firebase.assertSucceeds(testDoc.get());
    });

    it("Can't Write Items In The Read-Only Collections", async () => {
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID}).firestore();
        const testDoc = db.collection("read_only").doc("test_write_doc");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Write To A User Document With The Same ID As Our User", async () => {
        const myAuthObject = {uid: "user_abc", email: "abc@gmail.com"};
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: myAuthObject}).firestore();
        const testDoc = db.collection("user").doc("user_abc");
        await firebase.assertSucceeds(testDoc.set({foo: "bar"}));
    });

    it("Can't Write To A User Document With A Different ID As Our User", async () => {
        const myAuthObject = {uid: "user_abc", email: "abc@gmail.com"};
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: myAuthObject}).firestore();
        const testDoc = db.collection("user").doc("user_xyc");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Read Posts That Marked As Public", async () => {
        const db = getFirestore(null);
        const testQuery = db.collection("posts").where("visibility", "==", "public");
        await firebase.assertSucceeds(testQuery.get());
    });

    it("Can Query My Personal Posts", async () => {
        const db = getFirestore(myAuthObject);
        const testQuery = db.collection("posts").where("authorId", "==", myID);
        await firebase.assertSucceeds(testQuery.get());
    });

    it("Can't Query All Posts", async () => {
        const db = getFirestore(myAuthObject);
        const testQuery = db.collection("posts");
        await firebase.assertFails(testQuery.get());
    });

    // Optional - Use With getAdminFirestore()
    it("Admin Can Write A Public Post And Then Can Read A Single Post As Annonymouse User", async () => {
        const admin = getAdminFirestore();
        const postId = "public_post";
        const setupDoc = admin.collection("posts").doc(postId);
        await setupDoc.set({authorId: theirId, visibility: "public"});

        const db = getFirestore(null);
        const testRead = db.collection("posts").doc(postId);
        await firebase.assertSucceeds(testRead.get());
    });

    it("Can Read A Private Post That Belonging To The User", async () => {
        const admin = getAdminFirestore();
        const postId = "private_post";
        const setupDoc = admin.collection("posts").doc(postId);
        await setupDoc.set({authorId: myID, visibility: "public"});

        const db = getFirestore(myAuthObject);
        const testRead = db.collection("posts").doc(postId);
        await firebase.assertSucceeds(testRead.get());
    });

    it("Can't Read A Private Post That Belonging To Another User", async () => {
        const admin = getAdminFirestore();
        const postId = "private_post";
        const setupDoc = admin.collection("posts").doc(postId);
        await setupDoc.set({authorId: theirId, visibility: "private"});

        const db = getFirestore(myAuthObject);
        const testRead = db.collection("posts").doc(postId);
        await firebase.assertFails(testRead.get());
    });


    // Optional - Use With getFirestore()
    it("Can't Write Items In The Read-Only Collections - With getFirestore()", async () => {
        const db = getFirestore(myAuthObject);
        const testDoc = db.collection("read_only").doc("test_write_doc");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Write To A User Document With The Same ID As Our User - With getFirestore()", async () => {
        const myAuthObject = {uid: "user_abc", email: "abc@gmail.com"};
        const db = getFirestore(myAuthObject);
        const testDoc = db.collection("user").doc(myID);
        await firebase.assertSucceeds(testDoc.set({foo: "bar"}));
    });

    it("Can't Write To A User Document With A Different ID As Our User - With getFirestore()", async () => {
        const db = getFirestore(myAuthObject);
        const testDoc = db.collection("user").doc(theirId);
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Read Items In The Read-Only Collections", async () => {
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID}).firestore();
        const testDoc = db.collection("read_only").doc("test_doc");
        await firebase.assertSucceeds(testDoc.get());
    });

    it("Can't Write Items In The Read-Only Collections", async () => {
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID}).firestore();
        const testDoc = db.collection("read_only").doc("test_write_doc");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Write To A User Document With The Same ID As Our User", async () => {
        const myAuthObject = {uid: "user_abc", email: "abc@gmail.com"};
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: myAuthObject}).firestore();
        const testDoc = db.collection("user").doc("user_abc");
        await firebase.assertSucceeds(testDoc.set({foo: "bar"}));
    });

    it("Can't Write To A User Document With A Different ID As Our User", async () => {
        const myAuthObject = {uid: "user_abc", email: "abc@gmail.com"};
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: myAuthObject}).firestore();
        const testDoc = db.collection("user").doc("user_xyc");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Read Posts That Marked As Public", async () => {
        const db = getFirestore(null);
        const testQuery = db.collection("posts").where("visibility", "==", "public");
        await firebase.assertSucceeds(testQuery.get());
    });

    it("Can Query My Personal Posts", async () => {
        const db = getFirestore(myAuthObject);
        const testQuery = db.collection("posts").where("authorId", "==", myID);
        await firebase.assertSucceeds(testQuery.get());
    });

    it("Can't Query All Posts", async () => {
        const db = getFirestore(myAuthObject);
        const testQuery = db.collection("posts");
        await firebase.assertFails(testQuery.get());
    });

    // Optional - Use With getAdminFirestore()
    it("Admin Can Write A Public Post And Then Can Read A Single Post As Annonymouse User", async () => {
        const admin = getAdminFirestore();
        const postId = "public_post";
        const setupDoc = admin.collection("posts").doc(postId);
        await setupDoc.set({authorId: theirId, visibility: "public"});

        const db = getFirestore(null);
        const testRead = db.collection("posts").doc(postId);
        await firebase.assertSucceeds(testRead.get());
    });

    it("Can Read A Private Post That Belonging To The User", async () => {
        const admin = getAdminFirestore();
        const postId = "private_post";
        const setupDoc = admin.collection("posts").doc(postId);
        await setupDoc.set({authorId: myID, visibility: "public"});

        const db = getFirestore(myAuthObject);
        const testRead = db.collection("posts").doc(postId);
        await firebase.assertSucceeds(testRead.get());
    });

    it("Can't Read A Private Post That Belonging To Another User", async () => {
        const admin = getAdminFirestore();
        const postId = "private_post";
        const setupDoc = admin.collection("posts").doc(postId);
        await setupDoc.set({authorId: theirId, visibility: "private"});

        const db = getFirestore(myAuthObject);
        const testRead = db.collection("posts").doc(postId);
        await firebase.assertFails(testRead.get());
    });


    // Optional - Use With getFirestore()
    it("Can't Write Items In The Read-Only Collections - With getFirestore()", async () => {
        const db = getFirestore(myAuthObject);
        const testDoc = db.collection("read_only").doc("test_write_doc");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Write To A User Document With The Same ID As Our User - With getFirestore()", async () => {
        const myAuthObject = {uid: "user_abc", email: "abc@gmail.com"};
        const db = getFirestore(myAuthObject);
        const testDoc = db.collection("user").doc(myID);
        await firebase.assertSucceeds(testDoc.set({foo: "bar"}));
    });

    it("Can't Write To A User Document With A Different ID As Our User - With getFirestore()", async () => {
        const db = getFirestore(myAuthObject);
        const testDoc = db.collection("user").doc(theirId);
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Read Items In The Read-Only Collections", async () => {
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID}).firestore();
        const testDoc = db.collection("read_only").doc("test_doc");
        await firebase.assertSucceeds(testDoc.get());
    });

    it("Can't Write Items In The Read-Only Collections", async () => {
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID}).firestore();
        const testDoc = db.collection("read_only").doc("test_write_doc");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Write To A User Document With The Same ID As Our User", async () => {
        const myAuthObject = {uid: "user_abc", email: "abc@gmail.com"};
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: myAuthObject}).firestore();
        const testDoc = db.collection("user").doc("user_abc");
        await firebase.assertSucceeds(testDoc.set({foo: "bar"}));
    });

    it("Can't Write To A User Document With A Different ID As Our User", async () => {
        const myAuthObject = {uid: "user_abc", email: "abc@gmail.com"};
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: myAuthObject}).firestore();
        const testDoc = db.collection("user").doc("user_xyc");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Read Posts That Marked As Public", async () => {
        const db = getFirestore(null);
        const testQuery = db.collection("posts").where("visibility", "==", "public");
        await firebase.assertSucceeds(testQuery.get());
    });

    it("Can Query My Personal Posts", async () => {
        const db = getFirestore(myAuthObject);
        const testQuery = db.collection("posts").where("authorId", "==", myID);
        await firebase.assertSucceeds(testQuery.get());
    });

    it("Can't Query All Posts", async () => {
        const db = getFirestore(myAuthObject);
        const testQuery = db.collection("posts");
        await firebase.assertFails(testQuery.get());
    });

    // Optional - Use With getAdminFirestore()
    it("Admin Can Write A Public Post And Then Can Read A Single Post As Annonymouse User", async () => {
        const admin = getAdminFirestore();
        const postId = "public_post";
        const setupDoc = admin.collection("posts").doc(postId);
        await setupDoc.set({authorId: theirId, visibility: "public"});

        const db = getFirestore(null);
        const testRead = db.collection("posts").doc(postId);
        await firebase.assertSucceeds(testRead.get());
    });

    it("Can Read A Private Post That Belonging To The User", async () => {
        const admin = getAdminFirestore();
        const postId = "private_post";
        const setupDoc = admin.collection("posts").doc(postId);
        await setupDoc.set({authorId: myID, visibility: "public"});

        const db = getFirestore(myAuthObject);
        const testRead = db.collection("posts").doc(postId);
        await firebase.assertSucceeds(testRead.get());
    });

    it("Can't Read A Private Post That Belonging To Another User", async () => {
        const admin = getAdminFirestore();
        const postId = "private_post";
        const setupDoc = admin.collection("posts").doc(postId);
        await setupDoc.set({authorId: theirId, visibility: "private"});

        const db = getFirestore(myAuthObject);
        const testRead = db.collection("posts").doc(postId);
        await firebase.assertFails(testRead.get());
    });


    // Optional - Use With getFirestore()
    it("Can't Write Items In The Read-Only Collections - With getFirestore()", async () => {
        const db = getFirestore(myAuthObject);
        const testDoc = db.collection("read_only").doc("test_write_doc");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Write To A User Document With The Same ID As Our User - With getFirestore()", async () => {
        const myAuthObject = {uid: "user_abc", email: "abc@gmail.com"};
        const db = getFirestore(myAuthObject);
        const testDoc = db.collection("user").doc(myID);
        await firebase.assertSucceeds(testDoc.set({foo: "bar"}));
    });

    it("Can't Write To A User Document With A Different ID As Our User - With getFirestore()", async () => {
        const db = getFirestore(myAuthObject);
        const testDoc = db.collection("user").doc(theirId);
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Read Items In The Read-Only Collections", async () => {
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID}).firestore();
        const testDoc = db.collection("read_only").doc("test_doc");
        await firebase.assertSucceeds(testDoc.get());
    });

    it("Can't Write Items In The Read-Only Collections", async () => {
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID}).firestore();
        const testDoc = db.collection("read_only").doc("test_write_doc");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Write To A User Document With The Same ID As Our User", async () => {
        const myAuthObject = {uid: "user_abc", email: "abc@gmail.com"};
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: myAuthObject}).firestore();
        const testDoc = db.collection("user").doc("user_abc");
        await firebase.assertSucceeds(testDoc.set({foo: "bar"}));
    });

    it("Can't Write To A User Document With A Different ID As Our User", async () => {
        const myAuthObject = {uid: "user_abc", email: "abc@gmail.com"};
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: myAuthObject}).firestore();
        const testDoc = db.collection("user").doc("user_xyc");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Read Posts That Marked As Public", async () => {
        const db = getFirestore(null);
        const testQuery = db.collection("posts").where("visibility", "==", "public");
        await firebase.assertSucceeds(testQuery.get());
    });

    it("Can Query My Personal Posts", async () => {
        const db = getFirestore(myAuthObject);
        const testQuery = db.collection("posts").where("authorId", "==", myID);
        await firebase.assertSucceeds(testQuery.get());
    });

    it("Can't Query All Posts", async () => {
        const db = getFirestore(myAuthObject);
        const testQuery = db.collection("posts");
        await firebase.assertFails(testQuery.get());
    });

    // Optional - Use With getAdminFirestore()
    it("Admin Can Write A Public Post And Then Can Read A Single Post As Annonymouse User", async () => {
        const admin = getAdminFirestore();
        const postId = "public_post";
        const setupDoc = admin.collection("posts").doc(postId);
        await setupDoc.set({authorId: theirId, visibility: "public"});

        const db = getFirestore(null);
        const testRead = db.collection("posts").doc(postId);
        await firebase.assertSucceeds(testRead.get());
    });

    it("Can Read A Private Post That Belonging To The User", async () => {
        const admin = getAdminFirestore();
        const postId = "private_post";
        const setupDoc = admin.collection("posts").doc(postId);
        await setupDoc.set({authorId: myID, visibility: "public"});

        const db = getFirestore(myAuthObject);
        const testRead = db.collection("posts").doc(postId);
        await firebase.assertSucceeds(testRead.get());
    });

    it("Can't Read A Private Post That Belonging To Another User", async () => {
        const admin = getAdminFirestore();
        const postId = "private_post";
        const setupDoc = admin.collection("posts").doc(postId);
        await setupDoc.set({authorId: theirId, visibility: "private"});

        const db = getFirestore(myAuthObject);
        const testRead = db.collection("posts").doc(postId);
        await firebase.assertFails(testRead.get());
    });


    // Optional - Use With getFirestore()
    it("Can't Write Items In The Read-Only Collections - With getFirestore()", async () => {
        const db = getFirestore(myAuthObject);
        const testDoc = db.collection("read_only").doc("test_write_doc");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Write To A User Document With The Same ID As Our User - With getFirestore()", async () => {
        const myAuthObject = {uid: "user_abc", email: "abc@gmail.com"};
        const db = getFirestore(myAuthObject);
        const testDoc = db.collection("user").doc(myID);
        await firebase.assertSucceeds(testDoc.set({foo: "bar"}));
    });

    it("Can't Write To A User Document With A Different ID As Our User - With getFirestore()", async () => {
        const db = getFirestore(myAuthObject);
        const testDoc = db.collection("user").doc(theirId);
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Read Items In The Read-Only Collections", async () => {
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID}).firestore();
        const testDoc = db.collection("read_only").doc("test_doc");
        await firebase.assertSucceeds(testDoc.get());
    });

    it("Can't Write Items In The Read-Only Collections", async () => {
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID}).firestore();
        const testDoc = db.collection("read_only").doc("test_write_doc");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Write To A User Document With The Same ID As Our User", async () => {
        const myAuthObject = {uid: "user_abc", email: "abc@gmail.com"};
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: myAuthObject}).firestore();
        const testDoc = db.collection("user").doc("user_abc");
        await firebase.assertSucceeds(testDoc.set({foo: "bar"}));
    });

    it("Can't Write To A User Document With A Different ID As Our User", async () => {
        const myAuthObject = {uid: "user_abc", email: "abc@gmail.com"};
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: myAuthObject}).firestore();
        const testDoc = db.collection("user").doc("user_xyc");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Read Posts That Marked As Public", async () => {
        const db = getFirestore(null);
        const testQuery = db.collection("posts").where("visibility", "==", "public");
        await firebase.assertSucceeds(testQuery.get());
    });

    it("Can Query My Personal Posts", async () => {
        const db = getFirestore(myAuthObject);
        const testQuery = db.collection("posts").where("authorId", "==", myID);
        await firebase.assertSucceeds(testQuery.get());
    });

    it("Can't Query All Posts", async () => {
        const db = getFirestore(myAuthObject);
        const testQuery = db.collection("posts");
        await firebase.assertFails(testQuery.get());
    });

    // Optional - Use With getAdminFirestore()
    it("Admin Can Write A Public Post And Then Can Read A Single Post As Annonymouse User", async () => {
        const admin = getAdminFirestore();
        const postId = "public_post";
        const setupDoc = admin.collection("posts").doc(postId);
        await setupDoc.set({authorId: theirId, visibility: "public"});

        const db = getFirestore(null);
        const testRead = db.collection("posts").doc(postId);
        await firebase.assertSucceeds(testRead.get());
    });

    it("Can Read A Private Post That Belonging To The User", async () => {
        const admin = getAdminFirestore();
        const postId = "private_post";
        const setupDoc = admin.collection("posts").doc(postId);
        await setupDoc.set({authorId: myID, visibility: "public"});

        const db = getFirestore(myAuthObject);
        const testRead = db.collection("posts").doc(postId);
        await firebase.assertSucceeds(testRead.get());
    });

    it("Can't Read A Private Post That Belonging To Another User", async () => {
        const admin = getAdminFirestore();
        const postId = "private_post";
        const setupDoc = admin.collection("posts").doc(postId);
        await setupDoc.set({authorId: theirId, visibility: "private"});

        const db = getFirestore(myAuthObject);
        const testRead = db.collection("posts").doc(postId);
        await firebase.assertFails(testRead.get());
    });


    // Optional - Use With getFirestore()
    it("Can't Write Items In The Read-Only Collections - With getFirestore()", async () => {
        const db = getFirestore(myAuthObject);
        const testDoc = db.collection("read_only").doc("test_write_doc");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Write To A User Document With The Same ID As Our User - With getFirestore()", async () => {
        const myAuthObject = {uid: "user_abc", email: "abc@gmail.com"};
        const db = getFirestore(myAuthObject);
        const testDoc = db.collection("user").doc(myID);
        await firebase.assertSucceeds(testDoc.set({foo: "bar"}));
    });

    it("Can't Write To A User Document With A Different ID As Our User - With getFirestore()", async () => {
        const db = getFirestore(myAuthObject);
        const testDoc = db.collection("user").doc(theirId);
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Read Items In The Read-Only Collections", async () => {
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID}).firestore();
        const testDoc = db.collection("read_only").doc("test_doc");
        await firebase.assertSucceeds(testDoc.get());
    });

    it("Can't Write Items In The Read-Only Collections", async () => {
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID}).firestore();
        const testDoc = db.collection("read_only").doc("test_write_doc");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Write To A User Document With The Same ID As Our User", async () => {
        const myAuthObject = {uid: "user_abc", email: "abc@gmail.com"};
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: myAuthObject}).firestore();
        const testDoc = db.collection("user").doc("user_abc");
        await firebase.assertSucceeds(testDoc.set({foo: "bar"}));
    });

    it("Can't Write To A User Document With A Different ID As Our User", async () => {
        const myAuthObject = {uid: "user_abc", email: "abc@gmail.com"};
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: myAuthObject}).firestore();
        const testDoc = db.collection("user").doc("user_xyc");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Read Posts That Marked As Public", async () => {
        const db = getFirestore(null);
        const testQuery = db.collection("posts").where("visibility", "==", "public");
        await firebase.assertSucceeds(testQuery.get());
    });

    it("Can Query My Personal Posts", async () => {
        const db = getFirestore(myAuthObject);
        const testQuery = db.collection("posts").where("authorId", "==", myID);
        await firebase.assertSucceeds(testQuery.get());
    });

    it("Can't Query All Posts", async () => {
        const db = getFirestore(myAuthObject);
        const testQuery = db.collection("posts");
        await firebase.assertFails(testQuery.get());
    });

    // Optional - Use With getAdminFirestore()
    it("Admin Can Write A Public Post And Then Can Read A Single Post As Annonymouse User", async () => {
        const admin = getAdminFirestore();
        const postId = "public_post";
        const setupDoc = admin.collection("posts").doc(postId);
        await setupDoc.set({authorId: theirId, visibility: "public"});

        const db = getFirestore(null);
        const testRead = db.collection("posts").doc(postId);
        await firebase.assertSucceeds(testRead.get());
    });

    it("Can Read A Private Post That Belonging To The User", async () => {
        const admin = getAdminFirestore();
        const postId = "private_post";
        const setupDoc = admin.collection("posts").doc(postId);
        await setupDoc.set({authorId: myID, visibility: "public"});

        const db = getFirestore(myAuthObject);
        const testRead = db.collection("posts").doc(postId);
        await firebase.assertSucceeds(testRead.get());
    });

    it("Can't Read A Private Post That Belonging To Another User", async () => {
        const admin = getAdminFirestore();
        const postId = "private_post";
        const setupDoc = admin.collection("posts").doc(postId);
        await setupDoc.set({authorId: theirId, visibility: "private"});

        const db = getFirestore(myAuthObject);
        const testRead = db.collection("posts").doc(postId);
        await firebase.assertFails(testRead.get());
    });


    // Optional - Use With getFirestore()
    it("Can't Write Items In The Read-Only Collections - With getFirestore()", async () => {
        const db = getFirestore(myAuthObject);
        const testDoc = db.collection("read_only").doc("test_write_doc");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

    it("Can Write To A User Document With The Same ID As Our User - With getFirestore()", async () => {
        const myAuthObject = {uid: "user_abc", email: "abc@gmail.com"};
        const db = getFirestore(myAuthObject);
        const testDoc = db.collection("user").doc(myID);
        await firebase.assertSucceeds(testDoc.set({foo: "bar"}));
    });

    it("Can't Write To A User Document With A Different ID As Our User - With getFirestore()", async () => {
        const db = getFirestore(myAuthObject);
        const testDoc = db.collection("user").doc(theirId);
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    });

});

after(async() => {
    await firebase.clearFirestoreData({projectId: MY_PROJECT_ID});
});