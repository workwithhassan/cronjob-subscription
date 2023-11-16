const cron = require('node-cron');

let userSubscriptions = [
  { userId: 'user1', subscriptionDate: '2023-11-16', package: 'monthly' },
  { userId: 'user2', subscriptionDate: '2022-01-01', package: 'monthly' },
  { userId: 'user3', subscriptionDate: '2022-05-01', package: 'monthly' },
  { userId: 'user4', subscriptionDate: '2023-03-01', package: 'monthly' },
];

console.log('Test data - User Subscriptions:');
/**
 * This will schedule the subscription to check 3 times a day.
 * Right now, it is set to check to run cron job every 5 seconds for testing purpose
 */
// cron.schedule('0 0 */8 * * *', () => {
cron.schedule('*/5 * * * * *', () => {
  checkSubscriptionsAndUpdate();
});

// This is our payment method. Right now it returns true.
function processPayment(userId, packageType) {
  console.log(`Processing payment for ${userId}, package: ${packageType}`);
  return true;
}

function updateSubscriptionDate(userId, packageType) {
  let newDate = new Date();
  switch (packageType) {
    case 'monthly':
      newDate.setMonth(newDate.getMonth() + 1);
      break;
  }
  userSubscriptions = userSubscriptions.map(subscription => {
    if (subscription.userId === userId) {
      return {
        ...subscription,
        subscriptionDate: newDate.toISOString().split('T')[0],
      };
    }
    return subscription;
  });
  console.log(
    `Subscription updated for ${userId} to ${
      newDate.toISOString().split('T')[0]
    }`
  );
}

function checkSubscriptionsAndUpdate() {
  // console.log('Check subsription is running in cron job: ', userSubscriptions);

  userSubscriptions.forEach(subscription => {
    const today = new Date().toISOString().split('T')[0];
    console.log('Today: ', today);

    if (subscription.subscriptionDate === today) {
      console.log(`Checking subscription for user: ${subscription.userId}`);

      if (processPayment(subscription.userId, subscription.package)) {
        updateSubscriptionDate(subscription.userId, subscription.package);
      } else {
        console.log(`Payment failed for user: ${subscription.userId}`);
      }
    } else {
      console.log('Subscription is not due yet');
    }
  });
}
