//************************************************************************************
//
// Author: Alejandro Demian Velasco
//
// Node application using Twitter API to gather Twitter feeds from different locations.
// - Execute sentiment analysis to every post and track the overall mood
//
// - Find potential friendships and determine the group of friends based on mutual
//   followers.
//
//	Node Modules:
//         Sentiment
//         Twit
//
// The Tweets and the user's information is NOT stored. It is to simply analyze the data
// generated.
//
//************************************************************************************

// Sentiment node module
var sentiment = require('sentiment');
// Twit node module
var Twit = require('twit')

// Global variables
var errorAlert = "A unicorn went missing!"
var groupOfFriends = {};
var overallSentiment = null;

var locationData = {
	 followers_watermark: 0,
	 previous_most_followed_user: null

};


// Twitter User Credentials:
var T = new Twit({
	consumer_key:         'xxx..'
	, consumer_secret:      'xxx..'
	, access_token:         'xxx..'
	, access_token_secret:  'xxx..'
})


// Location coordinates
var SanFran = [ '-122.75', '36.8', '-121.75', '37.8' ]


var stream = T.stream('statuses/filter', { locations: SanFran })

// When a new Tweet is posted, pull it.
stream.on('tweet', function (tweet) {

	// Local variables
	// User and tweet data
	var usedId = tweet.user.id;
	var tweetText = tweet.text;
	var screenName = tweet.user.screen_name;
	var followersCount = tweet.user.friends_count;
	// Placeholders
	var friendsList = null;
	var previousMostFollowed;


	// Run Sentiment Analysis
	var sentimentResult = sentiment(tweetText);

	var currentMostFollowers = locationData["followers_watermark"];
	// Who has the most followers?
	if (followersCount > currentMostFollowers)
	{
		previousMostFollowed = locationData["most_followed_user"];
		locationData["previous_most_followed_user"] = previousMostFollowed
		locationData["most_followed_user"] = screenName;
		locationData["followers_watermark"] = followersCount;
	}

	locationData["current_mood"] = currentMood(sentimentResult);
	console.log(locationData);

	T.get('followers/user_id', { screen_name: screenName },  function (err, followersList, response) {
		// If nothing has gone wrong, return data requested
		// console.log(followersList);
		// followerList holds screen names of followers for the current user
		for (var key in followerList) {
			friendScreenName = followerList[keys];
		  T.get('followers/user_id', { screen_name: friendScreenName },  function (err, friendFollowersList, response) {
		  // If nothing has gone wrong, return data requested
			// set key to user's screen name
			keyForFriendGroup = screenName + '_friends';
			// Empty list for common friends
			var commonFriendList {};
			// index starting at zero to traverse through friend's object
			var friendsIndex = 0;
			// look for user's screen name in friend's followers
			for (var key in friendFollowersList) {
				var secondDegreeFollower = friendFollowersList;
				if (secondDegreeFollower == screenName ) {
					// Found user's screenName in followers friends list.
					// Friends in commong
					commonFriendList[friendsIndex] = secondDegreeFollower;
					friendsIndex += 1;
				}
			}
			groupOfFriends[screenName] = commonFriendList;
		  })
		}
	})
console.log(groupOfFriends);
})


// Sentiment analysis function
// Sets the value for location's current mood
function currentMood (sentimentResult) {

	var mood = {
		current: null
	};
	var sentimentScore = sentimentResult.score;

		// Determine positivity or negative from the text
		// Fairly happy tweet
		if (sentimentScore > 0 & sentimentScore < 3)
		{
			overallSentiment += 1;
		}
		// Very Happy tweet
		if (sentimentScore >= 3)
		{
			overallSentiment += 2;
		}
		// Negative Tweet
		if (sentimentScore < 0 & sentimentScore > -3)
		{
			overallSentiment -= 1;
		}
		// Very negative tweet
		if (sentimentScore <= -3)
		{
			overallSentiment += 2;
		}

		if (overallSentiment > 0)
		{
			mood.current = "Positive";

		} else
		{
			mood.current = "Negative";
		}
		return mood.current;
	}
