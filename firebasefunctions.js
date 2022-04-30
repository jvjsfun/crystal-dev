const functions = require('firebase-functions');
const admin = require('firebase-admin');
// const _ = require('lodash');

admin.initializeApp(functions.config().firebase);

exports.sendFriendRequestNotification = functions.database.ref('/Users/{userid}/friendRequests/{sentUserid}').onCreate(event => {

	let userid = event.params.userid;
	console.log(event);

	let sentUserid = event.params.sentUserid;
	console.log(sentUserid);

    const getValuePromise = admin.database()
                                 .ref('Users/'+sentUserid)
                                 // .orderByKey()
                                 // .limitToLast(1)
                                 .once('value');

    return getValuePromise.then(snapshot => {

        let user = snapshot.val();
        const payload = {
            notification: {
                // title: "New friend request",
                body: "You have a new friend request!",
                // icon: user.photoURL,
                sound: "graceful.caf",
                priority: "high", 
                badge:"1",
            },

            data:{
                navigate: "AddedMe",
                show_in_foreground:"true",

            }

        };

        console.log(payload)


        return admin.messaging()
                    .sendToTopic(userid, payload)
                    .then(result => console.log(result))
            		.catch(error => console.error(error));
    });
});

exports.sendMessageNotification = functions.database.ref('/Chats/{planId}/{messageid}').onCreate(event => {

	let planId = event.params.planId;
	let messageid = event.params.messageid;
	

    const getValuePromise = admin.database()
                                 .ref('Chats/'+planId+"/"+messageid)
                                 // .orderByKey()
                                 // .limitToLast(1)
                                 .once('value');

    return getValuePromise.then(snapshot => {

        let message = snapshot.val();
        admin.database().ref('Plans/'+planId).once('value').then(snapshot2 => {

            let plan = snapshot2.val();


            const payload = {
                notification: {
                    body: message.user.name.split(" ")[0] + " to " + plan.planName + ": " + message.text,
                    // body: " has messaged you.",
                    // icon: message.user.avatar,
                    sound: "graceful.caf",
                    priority: "high", 
                    badge:"1",
                  
                },
                data:{
                    navigate: "ChatPage",
                    planId:planId,
                    sentUserid: message.user._id,
                    planName:plan.planName,
                    dateEpoch:""+plan.dateEpoch,
                    location:plan.location,
                    // show_in_foreground:"true",
                }

            };

            console.log(payload)


            return admin.messaging()
                        .sendToTopic(planId, payload)
                        .then(result => console.log(result))
                		.catch(error => console.error(error));
        });
    });
});

exports.sendPlanInviteNotification = functions.database.ref('/Users/{userid}/invited/{planId}').onCreate(event => {

	let userid = event.params.userid;
	console.log(event);

	let planId = event.params.planId;
	console.log(planId);

    const getValuePromise = admin.database()
                                 .ref('Plans/'+planId)
                                 // .orderByKey()
                                 // .limitToLast(1)
                                 .once('value');

    return getValuePromise.then(snapshot => {

        let plan = snapshot.val();

        const getUserPromise = admin.database().ref('Users/'+userid).once('value');
        return getUserPromise.then(snapshot2 => {

            let user = snapshot2.val();
            if(user.viewed && user.viewed[planId]){
                return;
            }
            
            const payload = {
                notification: {
                    // title: "New plan invite",
                    body: plan.hostName.split(" ")[0] + " created a new plan and wants you to join!",
                    // icon: plan.photoURL,
                    sound: "hide-and-seek.caf",
                    priority: "high", 
                    badge:"1",
                    
                },
                data:{
                    navigate: "Events",
                    show_in_foreground:"true",
                }
            };

            console.log(payload)


            return admin.messaging()
                        .sendToTopic(userid, payload)
                        .then(result => console.log(result))
                        .catch(error => console.error(error));


        });
    });
});

exports.sendPlanAcceptanceNotification = functions.database.ref('/Plans/{planId}/going/{userid}').onCreate(event => {

    let userid = event.params.userid;
    console.log(event);

    let planId = event.params.planId;
    console.log(planId);

    const getValuePromise = admin.database()
                                 .ref('Users/'+userid)
                                 // .orderByKey()
                                 // .limitToLast(1)
                                 .once('value');

    return getValuePromise.then(snapshot => {

        let user = snapshot.val();

        return admin.database().ref('Plans/'+planId).once('value').then(snapshot2 => {

            let plan = snapshot2.val();

            const payload = {
                notification: {
                    // title: "New plan acceptance",
                    body: user.fullname.split(" ")[0] + " joined your plan!",
                    // icon: user.photoURL,
                    sound: "graceful.caf",
                    priority: "high", 
                    badge:"1",
                    
                },

                data:{
                    navigate: "ChatPage",
                    planId:planId,
                    planName:plan.planName,
                    dateEpoch:""+plan.dateEpoch,
                    location:plan.location,
                    show_in_foreground:"true",
                },
            };  
            

            console.log(payload)


            return admin.messaging()
                        .sendToTopic(plan.host, payload)
                        .then(result => console.log(result))
                        .catch(error => console.error(error));

        });
    });
});

exports.sendPlanInterestNotification = functions.database.ref('/Plans/{planId}/interested/{userid}').onCreate(event => {

    let userid = event.params.userid;
    console.log(event);

    let planId = event.params.planId;
    console.log(planId);

    const getValuePromise = admin.database()
                                 .ref('Users/'+userid)
                                 // .orderByKey()
                                 // .limitToLast(1)
                                 .once('value');

    return getValuePromise.then(snapshot => {

        let user = snapshot.val();

        return admin.database().ref('Plans/'+planId).once('value').then(snapshot2 => {

            let plan = snapshot2.val();

            const payload = {
                notification: {
                    // title: "New plan acceptance",
                    body: user.fullname.split(" ")[0] + " is interested in your plan!",
                    // icon: user.photoURL,
                    sound: "graceful.caf",
                    priority: "high", 
                    badge:"1",
                    
                },

                data:{
                    navigate: "ChatPage",
                    planId:planId,
                    planName:plan.planName,
                    dateEpoch:""+plan.dateEpoch,
                    location:plan.location,
                    show_in_foreground:"true",
                },
            };  
            

            console.log(payload)


            return admin.messaging()
                        .sendToTopic(plan.host, payload)
                        .then(result => console.log(result))
                        .catch(error => console.error(error));

        });
    });
});

exports.sendFriendRequestAcceptanceNotification = functions.database.ref('/Users/{userid}/currentFriends/{friendid}').onCreate(event => {

    let userid = event.params.userid;
    console.log(userid);

    let friendid = event.params.friendid;
    console.log(friendid);

    const getValuePromise = admin.database()
                                 .ref('Users/'+friendid)
                                 // .orderByKey()
                                 // .limitToLast(1)
                                 .once('value');

    return getValuePromise.then(snapshot => {

        let friendUser = snapshot.val();

        const payload = {
            notification: {
                // title: "New friend",
                body: friendUser.fullname.split(" ")[0] + " and you are now friends!",
                // icon: friendUser.photoURL,
                sound: "graceful.caf",
                priority: "high", 
                badge:"1",
                
            },
            data:{
                navigate: "MyFriends",
                show_in_foreground:"true",
            }
        };

        console.log(payload)


        return admin.messaging()
                    .sendToTopic(userid, payload)
                    .then(result => console.log(result))
                    .catch(error => console.error(error));


    });
});


