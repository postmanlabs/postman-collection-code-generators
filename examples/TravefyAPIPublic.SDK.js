const request = require('request');
const _ = require('lodash');

const configVariables = {
  'baseApiUrl': '',
  'platformPrivateKey': '',
  'platformPublicKey': '',
  'userId': '',
  'tripId': '',
  'tripPartnerId': '',
  'tripDayId': '',
  'tripUserId': ''
};

/**
![Travefy Developer API Documentation](https://s3.amazonaws.com/travefy-storage/content/Travefy-API-Banner.jpg)

Welcome to Travefy&#39;s API.  Here are some pre-made requests for you to explore the API using [Postman](https://getpostman.com).

# API Keys

You&#39;ll need your API keys, so contact [apisupport@travefy.com](mailto:apisupport@travefy.com) if you don&#39;t have them.

There is a public key and a private key for your platform. 

Think of your private key like a password:
- Store it securely
- Don&#39;t share it with anyone outside of your organization
- Don&#39;t put it in any code on your website or in a Url that someone could find

`Users` you&#39;ve created on the platform also have a `PublicKey` and private `AccessToken`. This `AccessToken` is specific to your platform and acts as a password for the `User`, so do not share this access token. It may be revoked by the `User` at any time.

Different calls in the API require different keys. For example, creating and managing `Users` requires your platform&#39;s secret key. Creating `Trips` on behalf of a `User` requires your platform&#39;s public key and the `AaccessToken` for the `User`. Check each call for the requirements.

# Setup

NOTE: You&#39;ll need to [create an environment in Postman](https://www.getpostman.com/docs/environments), select that environment, and enter your platform&#39;s api keys in the `0 - Setup/Environment Setup` pre-request script ([documentation on pre-request scripts](http://www.getpostman.com/docs/pre_request_scripts)) to set the environment variables.  Also, the calls have dependencies.  A `Trip` must be created before a `TripDay`, a `TripDay` must be created before a `TripEvent`, and `GET`/`UPDATE`/`DELETE` calls will only work after an item is created with a `POST`.

NOTE: The [Create Full Trip](#10087261-a1b2-a05d-966d-bcf4609fc649) request is the only request that allows child entities (days, events, and ideas) to be passed in with the parent entity.  All other calls will only affect the primary entity.

# Making Your First Call

Making your first call
Test that you have the headers setup by making a `GET` request to `/api/v1/echo` with the `X-API-PUBLIC-KEY` header set to your platform&#39;s public key.  [Here&#39;s the Postman test for that](#ae3d-d794-c1e9-ba9f-25414ce121bb). You should get a `HTTP 200 OK` response if your keys are correct.

Next, make a `GET` request to /api/v1/secureEcho with the `X-API-PUBLIC-KEY` and `X-API-PRIVATE-KEY` headers set to your platform&#39;s public and private keys. [Here&#39;s the Postman test for that](#bc0d6a-f565-164d-0699-baae5899a97e).  You should get a `HTTP 200 OK` response if your keys are correct.

# Environments

Environment | API Base Url | Web App Url
----------- | ------- | -----------
Sandbox | https://api.travefy.com:81/ | https://sandbox.travefy.com:81/
Production | https://api.travefy.com/ | https://sandbox.travefy.com/

Notes:
- Your platform will have separate API keys for each environment.
- Data created or modified in each environment will not affect the other.
- Data cannot be transfered from one environment to the other.


# Single Sign-On (SSO)

For platforms that have it enabled, `Users` can be authenticated into your platform the Travefy environment from your site.  To use this, `POST` a `form` to `https://{{your-travefy-platform-url}}/auth/tokenBasedLogin`.  The `User` will then be authenticated and redirected to their account page.

Here&#39;s a working example of SSO working within our Sandbox environment:
https://jsfiddle.net/6a100dyj/

You&#39;ll need to do a few changes from this example:
1. Change the base url from `travelco-sandbox.travefy.com` to your travefy platform url and remove port 81.
2. Add your platform&#39;s public key.  _NOTE: DO NOT add your Private Key to any public or user-accessible page_.
3. Add the user&#39;s access token.  _NOTE: This is a secure token and should be on a page that only authorized users can access._
4. Style the button.

# API Pricing
Click [here](https://intercom.help/travefy/api-and-developer-tools/api-pricing) for information on our API pricing.

# Questions/Comments/Suggestions

If you have any questions or comments, please let us know at [apisupport@travefy.com](mailto:apisupport@travefy.com).
@param {object} config - Variables to used in SDK. 
@param {String} config.baseApiUrl
@param {String} config.platformPrivateKey
@param {String} config.platformPublicKey
@param {String} config.userId
@param {String} config.tripId
@param {String} config.tripPartnerId
@param {String} config.tripDayId
@param {String} config.tripUserId
*/
function SDK(config = {}) {

  const self = this;

  /**
  Note: You need to run this before _any_ other request if you are using Postman.  If you&#39;re using another client, feel free to skip this.
  --------------------

  Add your API keys to the Pre-request Script and execute the `Environment Setup` request to setup the environment.

  ```
  //set your platform api keys here
  postman.setEnvironmentVariable(&quot;platformPrivateKey&quot;, &quot;&lt;YOUR-PLATFORM-PRIVATE-API-KEY&gt;&quot;);
  postman.setEnvironmentVariable(&quot;platformPublicKey&quot;, &quot;&lt;YOUR-PLATFORM-PUBLIC-API-KEY&gt;&quot;);
  ```
  */
  this.setup = {
    /**
    Test that calls with your platform&#39;s _private_ API key succeed.
    @param {object} variables - Variables used for this request
    @param {String} variables.baseApiUrl
    @param {String} variables.platformPublicKey
    @param {String} variables.platformPrivateKey
    @param {Function} callback - Callback function to return response (err, res)
    */
    "secureEcho": (variables, callback) => {
      if (typeof variables === 'function') {
        callback = variables;
        variables = {};
      }
      let baseApiUrl = variables.baseApiUrl || self.variables.baseApiUrl || '';
      let platformPublicKey = variables.platformPublicKey || self.variables.platformPublicKey || '';
      let platformPrivateKey = variables.platformPrivateKey || self.variables.platformPrivateKey || '';
      var options = {
        'method': 'GET',
        'url': '' + baseApiUrl + '/api/v1/secureEcho',
        'headers': {
          'X-API-PUBLIC-KEY': '' + platformPublicKey + '',
          'X-API-PRIVATE-KEY': '' + platformPrivateKey + ''
        }
      };
      request(options, function(error, response) {
        return callback(error, response);
      });
    },
    /**
    Test that calls with your platform&#39;s _public_ API key succeed.
    @param {object} variables - Variables used for this request
    @param {String} variables.baseApiUrl
    @param {String} variables.platformPublicKey
    @param {Function} callback - Callback function to return response (err, res)
    */
    "echo": (variables, callback) => {
      if (typeof variables === 'function') {
        callback = variables;
        variables = {};
      }
      let baseApiUrl = variables.baseApiUrl || self.variables.baseApiUrl || '';
      let platformPublicKey = variables.platformPublicKey || self.variables.platformPublicKey || '';
      var options = {
        'method': 'GET',
        'url': '' + baseApiUrl + '/api/v1/echo',
        'headers': {
          'X-API-PUBLIC-KEY': '' + platformPublicKey + ''
        }
      };
      request(options, function(error, response) {
        return callback(error, response);
      });
    }
  };

  /**
  Notes
  ------------
  In production, your platform may be charged for any created users.  Sandbox users are free to create.

  Request
  -------------

  `AgentSubscriptionLevel` values:

  - 0 = Starter
  - 1 = Plus
  - 2 = Premium

  Response Items
  -------------
  After successfully creating the `User`, `POST` method returns an object with the following properties:
  - `User` - The `User` that was created.
  - `AccessToke` - Your platform&#39;s `AccessToken` for this `User`, keep this securely stored like a password.
  - `PublicKey` - The `PublicKey` for this `User`, this is a unique, non-secure identifier and should be stored.
  - `AgentSubscriptionLevel` - The level of their Travefy Pro subscription.
  */
  this.users = {
    /**
    Create a `User` on the Travefy platform.

    The response of this request give you a chance to store the `AccessToken` and `PublicKey` for the `User`.  Those keys are also available on the `User` GET and GET by `Id` requests.  These are automatically stored in the Postman environment for testing.

    Note: if the `User` already has an account on Travefy, they&#39;ll need to authorize your Platform on their account.  Send them to https://{{your-travefy-platform-url}}/account/authorize and they can approve access.  You can then retrieve their tokens via the Get Users call. 

    &lt;!--
    ### Sample Response
    ```
    {
      &quot;User&quot;: {
        &quot;Id&quot;: 1234,
        &quot;FullName&quot;: &quot;Agent Level 1 User&quot;,
        &quot;ImageUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/content/default-4.gif&quot;,
        &quot;Username&quot;: &quot;agent1.1491421454@example.com&quot;,
        &quot;IsAgent&quot;: true,
        &quot;SubscriptionPeriodEnd&quot;: &quot;2019-10-10T00:00:00&quot;,
        &quot;AgentSubscriptionIsActive&quot;: true,
        &quot;Title&quot;: &quot;Travel Expert&quot;,
        &quot;Phone&quot;: &quot;555-555-1234&quot;,
        &quot;Url&quot;: &quot;https://travefy.com/&quot;,
        &quot;CompanyLogoUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/link-content/companyLogo/13551d3417bd481883931d9d8ff054aa.jpg&quot;
      },
      &quot;AccessToken&quot;: &quot;xxxxxxxxxxxx&quot;,
      &quot;PublicKey&quot;: &quot;xxxxxxxxxxxx&quot;,
      &quot;AgentSubscriptionLevel&quot;: 1,
      &quot;IsActive&quot;: true,
      &quot;CreatedOn&quot;: &quot;2017-04-05T19:44:13.4028771Z&quot;
    }
    ```
    --&gt;
    @param {object} variables - Variables used for this request
    @param {String} variables.baseApiUrl
    @param {String} variables.platformPrivateKey
    @param {String} variables.platformPublicKey
    @param {Function} callback - Callback function to return response (err, res)
    */
    "createUser": (variables, callback) => {
      if (typeof variables === 'function') {
        callback = variables;
        variables = {};
      }
      let baseApiUrl = variables.baseApiUrl || self.variables.baseApiUrl || '';
      let platformPrivateKey = variables.platformPrivateKey || self.variables.platformPrivateKey || '';
      let platformPublicKey = variables.platformPublicKey || self.variables.platformPublicKey || '';
      var options = {
        'method': 'POST',
        'url': '' + baseApiUrl + '/api/v1/users/',
        'headers': {
          'X-API-PRIVATE-KEY': '' + platformPrivateKey + '',
          'X-API-PUBLIC-KEY': '' + platformPublicKey + '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "User": {
            "Username": "agent1.{{$timestamp}}@example.com",
            "FullName": "Agent Level 1 User",
            "ImageUrl": "https://s3.amazonaws.com/travefy-storage/content/default-4.gif",
            "Title": "Travel Expert",
            "Phone": "555-555-1234",
            "Url": "https://travefy.com/",
            "CompanyLogoUrl": "https://s3.amazonaws.com/travefy-storage/link-content/companyLogo/13551d3417bd481883931d9d8ff054aa.jpg"
          },
          "AgentSubscriptionLevel": 1
        })

      };
      request(options, function(error, response) {
        return callback(error, response);
      });
    },
    /**
    Get a `User` from the Travefy platform by their `Id`.

    &lt;!--
    ### Sample Response
    ```
    {
        &quot;User&quot;: {
            &quot;Id&quot;: 1234,
            &quot;FullName&quot;: &quot;Agent Level 1 User&quot;,
            &quot;ImageUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/content/default-4.gif&quot;,
            &quot;Username&quot;: &quot;agent1.1491422490@example.com&quot;,
            &quot;IsAgent&quot;: true,
            &quot;SubscriptionPeriodEnd&quot;: &quot;2019-10-10T00:00:00&quot;,
            &quot;AgentSubscriptionIsActive&quot;: true,
            &quot;Title&quot;: &quot;Travel Expert&quot;,
            &quot;Phone&quot;: &quot;555-555-1234&quot;,
            &quot;Url&quot;: &quot;https://travefy.com/&quot;,
            &quot;CompanyLogoUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/link-content/companyLogo/13551d3417bd481883931d9d8ff054aa.jpg&quot;
        },
        &quot;AccessToken&quot;: &quot;xxxxxxxxxxxx&quot;,
        &quot;PublicKey&quot;: &quot;xxxxxxxxxxxx&quot;,
        &quot;AgentSubscriptionLevel&quot;: 1,
        &quot;IsActive&quot;: true,
        &quot;CreatedOn&quot;: &quot;2017-04-05T20:01:27.25&quot;
    }```
    --&gt;
    @param {object} variables - Variables used for this request
    @param {String} variables.baseApiUrl
    @param {String} variables.userId
    @param {String} variables.platformPrivateKey
    @param {String} variables.platformPublicKey
    @param {Function} callback - Callback function to return response (err, res)
    */
    "getUser": (variables, callback) => {
      if (typeof variables === 'function') {
        callback = variables;
        variables = {};
      }
      let baseApiUrl = variables.baseApiUrl || self.variables.baseApiUrl || '';
      let userId = variables.userId || self.variables.userId || '';
      let platformPrivateKey = variables.platformPrivateKey || self.variables.platformPrivateKey || '';
      let platformPublicKey = variables.platformPublicKey || self.variables.platformPublicKey || '';
      var options = {
        'method': 'GET',
        'url': '' + baseApiUrl + '/api/v1/users/' + userId + '',
        'headers': {
          'X-API-PRIVATE-KEY': '' + platformPrivateKey + '',
          'X-API-PUBLIC-KEY': '' + platformPublicKey + ''
        }
      };
      request(options, function(error, response) {
        return callback(error, response);
      });
    },
    /**
    Update a User.  Currently, this will update Username (email), FullName, and ImageUrl.

    &lt;!--
    ### Sample Response
    ```
    {
        &quot;User&quot;: {
            &quot;Id&quot;: 1234,
            &quot;FullName&quot;: &quot;nate test agent2&quot;,
            &quot;ImageUrl&quot;: null,
            &quot;Username&quot;: &quot;nate+agent1-1491422734-updated@example.com&quot;,
            &quot;IsAgent&quot;: true,
            &quot;SubscriptionPeriodEnd&quot;: &quot;2019-10-10T00:00:00&quot;,
            &quot;AgentSubscriptionIsActive&quot;: true,
            &quot;Title&quot;: &quot;Travel Expert&quot;,
            &quot;Phone&quot;: &quot;555-555-1234&quot;,
            &quot;Url&quot;: &quot;https://travefy.com/&quot;,
            &quot;CompanyLogoUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/link-content/companyLogo/13551d3417bd481883931d9d8ff054aa.jpg&quot;
        },
        &quot;AccessToken&quot;: &quot;xxxxxxxxxxxx&quot;,
        &quot;PublicKey&quot;: &quot;xxxxxxxxxxxx&quot;,
        &quot;AgentSubscriptionLevel&quot;: 1,
        &quot;IsActive&quot;: true,
        &quot;CreatedOn&quot;: &quot;2017-04-05T20:01:27.25&quot;
    }```
    --&gt;
    @param {object} variables - Variables used for this request
    @param {String} variables.baseApiUrl
    @param {String} variables.userId
    @param {String} variables.platformPrivateKey
    @param {String} variables.platformPublicKey
    @param {Function} callback - Callback function to return response (err, res)
    */
    "updateUser": (variables, callback) => {
      if (typeof variables === 'function') {
        callback = variables;
        variables = {};
      }
      let baseApiUrl = variables.baseApiUrl || self.variables.baseApiUrl || '';
      let userId = variables.userId || self.variables.userId || '';
      let platformPrivateKey = variables.platformPrivateKey || self.variables.platformPrivateKey || '';
      let platformPublicKey = variables.platformPublicKey || self.variables.platformPublicKey || '';
      var options = {
        'method': 'PUT',
        'url': '' + baseApiUrl + '/api/v1/users/' + userId + '',
        'headers': {
          'X-API-PRIVATE-KEY': '' + platformPrivateKey + '',
          'X-API-PUBLIC-KEY': '' + platformPublicKey + '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "user": {
            "username": "nate+agent1-{{$timestamp}}-updated@example.com",
            "fullName": "nate test agent2"
          }
        })

      };
      request(options, function(error, response) {
        return callback(error, response);
      });
    },
    /**
    Get all Users that your platform has access to.

    &lt;!--
    ### Sample Response
    ```[
      {
        &quot;User&quot;: {
          &quot;Id&quot;: 1234,
          &quot;FullName&quot;: &quot;nate not agent from api!&quot;,
          &quot;ImageUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/content/default-pro.png&quot;,
          &quot;Username&quot;: &quot;nate+notagentfromapi1455044172@example.com&quot;,
          &quot;IsAgent&quot;: false,
          &quot;SubscriptionPeriodEnd&quot;: null,
          &quot;AgentSubscriptionIsActive&quot;: false,
          &quot;Title&quot;: null,
          &quot;Phone&quot;: null,
          &quot;Url&quot;: null,
          &quot;CompanyLogoUrl&quot;: null
        },
        &quot;AccessToken&quot;: &quot;xxxxxxxxxxxx&quot;,
        &quot;PublicKey&quot;: &quot;xxxxxxxxxxxx&quot;,
        &quot;AgentSubscriptionLevel&quot;: null,
        &quot;IsActive&quot;: true,
        &quot;CreatedOn&quot;: &quot;0001-01-01T00:00:00&quot;
      },
      {
        &quot;User&quot;: {
          &quot;Id&quot;: 1235,
          &quot;FullName&quot;: &quot;nate agent from api!&quot;,
          &quot;ImageUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/content/default-pro.png&quot;,
          &quot;Username&quot;: &quot;nate+notagentfromapi1455045001@example.com&quot;,
          &quot;IsAgent&quot;: true,
          &quot;SubscriptionPeriodEnd&quot;: 2019-10-10T00:00:00,
          &quot;AgentSubscriptionIsActive&quot;: true,
          &quot;Title&quot;: Travel Expert,
          &quot;Phone&quot;: 555-555-1234,
          &quot;Url&quot;: &quot;https://travefy.com&quot;,
          &quot;CompanyLogoUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/link-content/companyLogo/13551d3417bd481883931d9d8ff054aa.jpg&quot;
        },
        &quot;AccessToken&quot;: &quot;xxxxxxxxxxxx&quot;,
        &quot;PublicKey&quot;: &quot;xxxxxxxxxxxx&quot;,
        &quot;AgentSubscriptionLevel&quot;: 1,
        &quot;IsActive&quot;: true,
        &quot;CreatedOn&quot;: &quot;0001-01-01T00:00:00&quot;
      },...```
      --&gt;
    @param {object} variables - Variables used for this request
    @param {String} variables.baseApiUrl
    @param {String} variables.platformPrivateKey
    @param {String} variables.platformPublicKey
    @param {Function} callback - Callback function to return response (err, res)
    */
    "getUsers": (variables, callback) => {
      if (typeof variables === 'function') {
        callback = variables;
        variables = {};
      }
      let baseApiUrl = variables.baseApiUrl || self.variables.baseApiUrl || '';
      let platformPrivateKey = variables.platformPrivateKey || self.variables.platformPrivateKey || '';
      let platformPublicKey = variables.platformPublicKey || self.variables.platformPublicKey || '';
      var options = {
        'method': 'GET',
        'url': '' + baseApiUrl + '/api/v1/users',
        'headers': {
          'X-API-PRIVATE-KEY': '' + platformPrivateKey + '',
          'X-API-PUBLIC-KEY': '' + platformPublicKey + ''
        }
      };
      request(options, function(error, response) {
        return callback(error, response);
      });
    }
  };

  /**
  # Notes

  Status can be set from one of the statuses the User has created in the web interface and is matched by the string provided.  The match is *not* case-sensitive.  If no matching Status is found, it is not set (&quot;No Status&quot; in the UI).  `Quote`, `Confirmed`, and `Paid` are default statuses for all agents currently, but this is subject to change.

  `TripIdeas` are a collection on a `TripEvent` and are often establishments or other info that is associated with the `TripEvent`.  For example, the event may be &quot;Beachside Dinner&quot; with a time and reservation info and the idea may be &quot;Shorebird Resturant&quot; with the location, hours, etc.  Currently these are completely stand-alone and will not connect with any existing items from the Travefy database or an agent&#39;s Content Library.  See the Create Full Trip request for an example usage.

  The `PartnerIdentifier` field on a `Trip` can be used to store _your_ identifier on the `Trip`.  For example, if you have a different identifier for the `Trip` in _your_ database, you can store that here.  You can then query the `Trip` by that identifier to get the Travefy `Id` for the `Trip`.  Note: This field must be unique across your platform.
  */
  this.trips = {
    /**
    Create an empty `Trip` on the Travefy platform.

    &lt;!--### Sample Response
    ```{
      &quot;Id&quot;: 1234,
      &quot;VerificationKey&quot;: xxxxxxxxxxxx,
      &quot;Name&quot;: &quot;Trip 1491423330&quot;,
      &quot;Active&quot;: true,
      &quot;CreatedOn&quot;: &quot;2017-04-05T20:15:26.5392324Z&quot;,
      &quot;InviteMessage&quot;: &quot;Welcome to the trip!&quot;,
      &quot;TripCoverPhotoUrl&quot;: &quot;http://lorempixel.com/640/480/city&quot;,
      &quot;EstimatedCost&quot;: &quot;$1,234&quot;,
      &quot;IsCostPerPerson&quot;: true,
      &quot;TripDays&quot;: null,
      &quot;SecondaryLogoUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/link-content/companyLogo/13551d3417bd481883931d9d8ff054aa.jpg&quot;
    }```--&gt;
    @param {object} variables - Variables used for this request
    @param {String} variables.baseApiUrl
    @param {String} variables.platformPublicKey
    @param {Function} callback - Callback function to return response (err, res)
    */
    "createTrip": (variables, callback) => {
      if (typeof variables === 'function') {
        callback = variables;
        variables = {};
      }
      let baseApiUrl = variables.baseApiUrl || self.variables.baseApiUrl || '';
      let platformPublicKey = variables.platformPublicKey || self.variables.platformPublicKey || '';
      var options = {
        'method': 'POST',
        'url': '' + baseApiUrl + '/api/v1/trips',
        'headers': {
          'X-USER-TOKEN': '{{user-access-token}}',
          'X-API-PUBLIC-KEY': '' + platformPublicKey + '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "Name": "Trip {{$timestamp}}",
          "InviteMessage": "Welcome to the trip!",
          "TripCoverPhotoUrl": "http://lorempixel.com/640/480/city",
          "EstimatedCost": "$1,234",
          "IsCostPerPerson": true,
          "PartnerIdentifier": "trip-{{$timestamp}}",
          "Status": "Quote",
          "IsChatDisabled": false
        })

      };
      request(options, function(error, response) {
        return callback(error, response);
      });
    },
    /**
    Create a `Trip` on the Travefy platform with a full itinerary (`TripDays` and `TripEvents`).

    &lt;!--### Sample Response
    ```
    {
        &quot;Id&quot;: 1234,
        &quot;VerificationKey&quot;: xxxxxxxxxxxx,
        &quot;Name&quot;: &quot;Trip 1491423686&quot;,
        &quot;Active&quot;: true,
        &quot;CreatedOn&quot;: &quot;2017-04-05T20:21:22.4826361Z&quot;,
        &quot;InviteMessage&quot;: &quot;Welcome to your trip!&quot;,
        &quot;TripCoverPhotoUrl&quot;: &quot;http://lorempixel.com/400/200/cats/&quot;,
        &quot;EstimatedCost&quot;: $1,234,
        &quot;IsCostPerPerson&quot;: true,
        &quot;TripDays&quot;: [
            {
                &quot;Id&quot;: 12345,
                &quot;TripId&quot;: 1234,
                &quot;Title&quot;: &quot;Trip Day 1491423686&quot;,
                &quot;Date&quot;: &quot;2017-01-27T00:00:00&quot;,
                &quot;Ordinal&quot;: 0.5,
                &quot;IsActive&quot;: true,
                &quot;CreatedOn&quot;: &quot;2017-04-05T20:21:22.5138857Z&quot;,
                &quot;TripEvents&quot;: [
                    {
                        &quot;Id&quot;: 123456,
                        &quot;TripDayId&quot;: 12345,
                        &quot;IsActive&quot;: true,
                        &quot;SegmentProviderName&quot;: &quot;Lincoln Grand Hotel&quot;,
                        &quot;SegmentProviderPhone&quot;: &quot;555-867-5309&quot;,
                        &quot;SegmentProviderUrl&quot;: &quot;https://lincolngrandhotel.com&quot;,
                        &quot;SegmentIdentifier&quot;: &quot;YP02XVDB&quot;,
                        &quot;Ordinal&quot;: 0.5,
                        &quot;Name&quot;: &quot;Trip Event 1491423686&quot;,
                        &quot;Description&quot;: &quot;Former hotel in Lincoln Nebraska&quot;,
                        &quot;StartTimeZoneId&quot;: null,
                        &quot;StartTimeInMinutes&quot;: null,
                        &quot;DurationInMinutes&quot;: null,
                        &quot;StartTerminal&quot;: null,
                        &quot;StartGate&quot;: null,
                        &quot;EndTerminal&quot;: null,
                        &quot;EndGate&quot;: null,
                        &quot;PriceInCents&quot;: 12345,
                        &quot;CurrencyCode&quot;: &quot;USD&quot;,
                        &quot;TransportationIdentifier&quot;: null,
                        &quot;EventType&quot;: 1,
                        &quot;IsEndingEvent&quot;: true,
                        &quot;IsArrival&quot;: false,
                        &quot;TripIdeas&quot;: [
                            {
                                &quot;Id&quot;: 654,
                                &quot;TripEventId&quot;: 123456,
                                &quot;Name&quot;: &quot;My Place&quot;,
                                &quot;ImageUrl&quot;: &quot;http://lorempixel.com/400/200/cats&quot;,
                                &quot;Url&quot;: &quot;https://example.com&quot;,
                                &quot;Description&quot;: &quot;A great place to visit!&quot;,
                                &quot;Latitude&quot;: 34.0784796,
                                &quot;Longitude&quot;: -107.6184694,
                                &quot;Address&quot;: &quot;123 W Main St&quot;,
                                &quot;City&quot;: &quot;Citytown&quot;,
                                &quot;State&quot;: &quot;NM&quot;,
                                &quot;ZipCode&quot;: &quot;54321&quot;,
                                &quot;Phone&quot;: 555-555-1234,
                                &quot;Country&quot;: &quot;US&quot;,
                                &quot;IsActive&quot;: true
                            }
                        ],
                    }
                ],
            }
        ],
        &quot;SecondaryLogoUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/link-content/companyLogo/13551d3417bd481883931d9d8ff054aa.jpg&quot;
    }```--&gt;
    @param {object} variables - Variables used for this request
    @param {String} variables.baseApiUrl
    @param {String} variables.platformPublicKey
    @param {Function} callback - Callback function to return response (err, res)
    */
    "createFullTrip": (variables, callback) => {
      if (typeof variables === 'function') {
        callback = variables;
        variables = {};
      }
      let baseApiUrl = variables.baseApiUrl || self.variables.baseApiUrl || '';
      let platformPublicKey = variables.platformPublicKey || self.variables.platformPublicKey || '';
      var options = {
        'method': 'POST',
        'url': '' + baseApiUrl + '/api/v1/trips',
        'headers': {
          'X-USER-TOKEN': '{{user-access-token}}',
          'X-API-PUBLIC-KEY': '' + platformPublicKey + '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "Name": "Trip {{$timestamp}}",
          "InviteMessage": "Welcome to your trip!",
          "TripCoverPhotoUrl": "http://lorempixel.com/400/200/cats/",
          "Status": "Quote",
          "PartnerIdentifier": "trip-{{$timestamp}}",
          "IsChatDisabled": true,
          "TripDays": [{
            "Title": "Trip Day {{$timestamp}}",
            "Date": "1/27/2017",
            "TripEvents": [{
              "Name": "Trip Event {{$timestamp}}",
              "SegmentProviderName": "Lincoln Grand Hotel",
              "SegmentProviderPhone": "555-867-5309",
              "SegmentProviderUrl": "https://lincolngrandhotel.com",
              "SegmentIdentifier": "YP02XVDB",
              "CurrencyCode": "USD",
              "PriceInCents": 12345,
              "EventType": 1,
              "IsEndingEvent": true,
              "TripIdeas": [{
                "Name": "My Place",
                "ImageUrl": "http://lorempixel.com/400/200/cats",
                "Url": "https://example.com",
                "Description": "A great place to visit!",
                "Latitude": 34.0784796,
                "Longitude": -107.6184694,
                "Address": "123 W Main St",
                "City": "Citytown",
                "State": "NM",
                "ZipCode": 87825,
                "Country": "US"
              }]
            }]
          }]
        })

      };
      request(options, function(error, response) {
        return callback(error, response);
      });
    },
    /**
    Get a `Trip` from the Travefy platform.

    &lt;!--### Sample Response
    ```
    {
        &quot;Id&quot;: 1234,
        &quot;VerificationKey&quot;: xxxxxxxxxxxx,
        &quot;Name&quot;: &quot;Trip 1491423686&quot;,
        &quot;Active&quot;: true,
        &quot;CreatedOn&quot;: &quot;2017-04-05T20:21:22.4826361Z&quot;,
        &quot;InviteMessage&quot;: &quot;Welcome to your trip!&quot;,
        &quot;TripCoverPhotoUrl&quot;: &quot;http://lorempixel.com/400/200/cats/&quot;,
        &quot;EstimatedCost&quot;: $1,234,
        &quot;IsCostPerPerson&quot;: true,
        &quot;TripDays&quot;: [
            {
                &quot;Id&quot;: 12345,
                &quot;TripId&quot;: 1234,
                &quot;Title&quot;: &quot;Trip Day 1491423686&quot;,
                &quot;Date&quot;: &quot;2017-01-27T00:00:00&quot;,
                &quot;Ordinal&quot;: 0.5,
                &quot;IsActive&quot;: true,
                &quot;CreatedOn&quot;: &quot;2017-04-05T20:21:22.5138857Z&quot;,
                &quot;TripEvents&quot;: [
                    {
                        &quot;Id&quot;: 123456,
                        &quot;TripDayId&quot;: 12345,
                        &quot;IsActive&quot;: true,
                        &quot;SegmentProviderName&quot;: &quot;Lincoln Grand Hotel&quot;,
                        &quot;SegmentProviderPhone&quot;: &quot;555-867-5309&quot;,
                        &quot;SegmentProviderUrl&quot;: &quot;https://lincolngrandhotel.com&quot;,
                        &quot;SegmentIdentifier&quot;: &quot;YP02XVDB&quot;,
                        &quot;Ordinal&quot;: 0.5,
                        &quot;Name&quot;: &quot;Trip Event 1491423686&quot;,
                        &quot;Description&quot;: &quot;Former hotel in Lincoln Nebraska&quot;,
                        &quot;StartTimeZoneId&quot;: null,
                        &quot;StartTimeInMinutes&quot;: null,
                        &quot;DurationInMinutes&quot;: null,
                        &quot;StartTerminal&quot;: null,
                        &quot;StartGate&quot;: null,
                        &quot;EndTerminal&quot;: null,
                        &quot;EndGate&quot;: null,
                        &quot;PriceInCents&quot;: 12345,
                        &quot;CurrencyCode&quot;: &quot;USD&quot;,
                        &quot;TransportationIdentifier&quot;: null,
                        &quot;EventType&quot;: 1,
                        &quot;IsEndingEvent&quot;: true,
                        &quot;IsArrival&quot;: false,
                        &quot;TripIdeas&quot;: [
                            {
                                &quot;Id&quot;: 654,
                                &quot;TripEventId&quot;: 123456,
                                &quot;Name&quot;: &quot;My Place&quot;,
                                &quot;ImageUrl&quot;: &quot;http://lorempixel.com/400/200/cats&quot;,
                                &quot;Url&quot;: &quot;https://example.com&quot;,
                                &quot;Description&quot;: &quot;A great place to visit!&quot;,
                                &quot;Latitude&quot;: 34.0784796,
                                &quot;Longitude&quot;: -107.6184694,
                                &quot;Address&quot;: &quot;123 W Main St&quot;,
                                &quot;City&quot;: &quot;Citytown&quot;,
                                &quot;State&quot;: &quot;NM&quot;,
                                &quot;ZipCode&quot;: &quot;54321&quot;,
                                &quot;Phone&quot;: 555-555-1234,
                                &quot;Country&quot;: &quot;US&quot;,
                                &quot;IsActive&quot;: true
                            }
                        ],
                    }
                ],
            }
        ],
        &quot;SecondaryLogoUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/link-content/companyLogo/13551d3417bd481883931d9d8ff054aa.jpg&quot;
    }```--&gt;
    @param {object} variables - Variables used for this request
    @param {String} variables.baseApiUrl
    @param {String} variables.tripId
    @param {String} variables.platformPublicKey
    @param {Function} callback - Callback function to return response (err, res)
    */
    "getTrip": (variables, callback) => {
      if (typeof variables === 'function') {
        callback = variables;
        variables = {};
      }
      let baseApiUrl = variables.baseApiUrl || self.variables.baseApiUrl || '';
      let tripId = variables.tripId || self.variables.tripId || '';
      let platformPublicKey = variables.platformPublicKey || self.variables.platformPublicKey || '';
      var options = {
        'method': 'GET',
        'url': '' + baseApiUrl + '/api/v1/trips/' + tripId + '',
        'headers': {
          'X-USER-TOKEN': '{{user-access-token}}',
          'X-API-PUBLIC-KEY': '' + platformPublicKey + ''
        }
      };
      request(options, function(error, response) {
        return callback(error, response);
      });
    },
    /**
    Get a `Trip` from the Travefy platform by `PartnerIdentifier`.
    @param {object} variables - Variables used for this request
    @param {String} variables.baseApiUrl
    @param {String} variables.tripPartnerId
    @param {String} variables.platformPublicKey
    @param {Function} callback - Callback function to return response (err, res)
    */
    "getTripByPartnerIdentifier": (variables, callback) => {
      if (typeof variables === 'function') {
        callback = variables;
        variables = {};
      }
      let baseApiUrl = variables.baseApiUrl || self.variables.baseApiUrl || '';
      let tripPartnerId = variables.tripPartnerId || self.variables.tripPartnerId || '';
      let platformPublicKey = variables.platformPublicKey || self.variables.platformPublicKey || '';
      var options = {
        'method': 'GET',
        'url': '' + baseApiUrl + '/api/v1/trips/?partnerIdentifier=' + tripPartnerId + '',
        'headers': {
          'X-USER-TOKEN': '{{user-access-token}}',
          'X-API-PUBLIC-KEY': '' + platformPublicKey + ''
        }
      };
      request(options, function(error, response) {
        return callback(error, response);
      });
    },
    /**
    Get every `Trip` created by your platform for the given `User`.

    &lt;!--### Sample Response

    ```
    [
      {
        &quot;Id&quot;: 10002,
        &quot;VerificationKey&quot;: xxxxxxxxxxxx,
        &quot;Name&quot;: &quot;Trip 1491423686&quot;,
        &quot;Active&quot;: true,
        &quot;CreatedOn&quot;: &quot;2017-04-05T20:21:22.4826361Z&quot;,
        &quot;InviteMessage&quot;: &quot;Welcome to your trip!&quot;,
        &quot;TripCoverPhotoUrl&quot;: &quot;http://lorempixel.com/400/200/cats/&quot;,
        &quot;EstimatedCost&quot;: null,
        &quot;IsCostPerPerson&quot;: null,
        &quot;TripDays&quot;: null,
        &quot;SecondaryLogoUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/link-content/companyLogo/13551d3417bd481883931d9d8ff054aa.jpg&quot;
      },
      {
        &quot;Id&quot;: 10001,
        &quot;VerificationKey&quot;: xxxxxxxxxxxx,
        &quot;Name&quot;: &quot;Trip 1491423330&quot;,
        &quot;Active&quot;: true,
        &quot;CreatedOn&quot;: &quot;2017-04-05T20:15:26.54&quot;,
        &quot;InviteMessage&quot;: &quot;Welcome to the trip!&quot;,
        &quot;TripCoverPhotoUrl&quot;: &quot;http://lorempixel.com/640/480/city&quot;,
        &quot;EstimatedCost&quot;: &quot;$1,234&quot;,
        &quot;IsCostPerPerson&quot;: true,
        &quot;TripDays&quot;: null,
        &quot;SecondaryLogoUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/link-content/companyLogo/13551d3417bd481883931d9d8ff054aa.jpg&quot;
      }
    ]```--&gt;
    @param {object} variables - Variables used for this request
    @param {String} variables.baseApiUrl
    @param {String} variables.platformPublicKey
    @param {Function} callback - Callback function to return response (err, res)
    */
    "getTrips": (variables, callback) => {
      if (typeof variables === 'function') {
        callback = variables;
        variables = {};
      }
      let baseApiUrl = variables.baseApiUrl || self.variables.baseApiUrl || '';
      let platformPublicKey = variables.platformPublicKey || self.variables.platformPublicKey || '';
      var options = {
        'method': 'GET',
        'url': '' + baseApiUrl + '/api/v1/trips',
        'headers': {
          'X-USER-TOKEN': '{{user-access-token}}',
          'X-API-PUBLIC-KEY': '' + platformPublicKey + ''
        }
      };
      request(options, function(error, response) {
        return callback(error, response);
      });
    },
    /**
    Update the `Trip` itinerary information AND metadata (`Name`, `TripCoverPhotoUrl`, etc.).  Note: do not pass up _any_ `TripDays` if you only want to update the metadata.

    If you pass up _any_ `TripDays`, the entire trip itinerary information will be replaced.  Chat messages and saved `TripIdeas` will be maintained, but all `TripDays`, `TripEvents`, and `TripIdeas` on `TripEvents` will be replaced.

    &lt;!--### Sample Response
    ```
    {
        &quot;Id&quot;: 1234,
        &quot;VerificationKey&quot;: xxxxxxxxxxxx,
        &quot;Name&quot;: &quot;Updated 1491423686&quot;,
        &quot;Active&quot;: true,
        &quot;CreatedOn&quot;: &quot;2017-04-05T20:21:22.4826361Z&quot;,
        &quot;InviteMessage&quot;: &quot;Welcome to your trip!&quot;,
        &quot;TripCoverPhotoUrl&quot;: &quot;http://lorempixel.com/400/200/cats/&quot;,
        &quot;EstimatedCost&quot;: $1,234,
        &quot;IsCostPerPerson&quot;: true,
        &quot;TripDays&quot;: [
            {
                &quot;Id&quot;: 12345,
                &quot;TripId&quot;: 1234,
                &quot;Title&quot;: &quot;Updated 1491423686&quot;,
                &quot;Date&quot;: &quot;2017-03-21T00:00:00&quot;,
                &quot;Ordinal&quot;: 0.5,
                &quot;IsActive&quot;: true,
                &quot;CreatedOn&quot;: &quot;2017-04-05T20:21:22.5138857Z&quot;,
                &quot;TripEvents&quot;: [
                    {
                        &quot;Id&quot;: 123456,
                        &quot;TripDayId&quot;: 12345,
                        &quot;IsActive&quot;: true,
                        &quot;SegmentProviderName&quot;: &quot;Lincoln Grand Hotel&quot;,
                        &quot;SegmentProviderPhone&quot;: &quot;555-867-5309&quot;,
                        &quot;SegmentProviderUrl&quot;: &quot;https://lincolngrandhotel.com&quot;,
                        &quot;SegmentIdentifier&quot;: &quot;YP02XVDB&quot;,
                        &quot;Ordinal&quot;: 0.5,
                        &quot;Name&quot;: &quot;Updated 1491423686&quot;,
                        &quot;Description&quot;: &quot;Former hotel in Lincoln Nebraska&quot;,
                        &quot;StartTimeZoneId&quot;: null,
                        &quot;StartTimeInMinutes&quot;: null,
                        &quot;DurationInMinutes&quot;: null,
                        &quot;StartTerminal&quot;: null,
                        &quot;StartGate&quot;: null,
                        &quot;EndTerminal&quot;: null,
                        &quot;EndGate&quot;: null,
                        &quot;PriceInCents&quot;: 13579,
                        &quot;CurrencyCode&quot;: &quot;USD&quot;,
                        &quot;TransportationIdentifier&quot;: null,
                        &quot;EventType&quot;: 1,
                        &quot;IsEndingEvent&quot;: true,
                        &quot;IsArrival&quot;: false,
                        &quot;TripIdeas&quot;: [
                            {
                                &quot;Id&quot;: 654,
                                &quot;TripEventId&quot;: 123456,
                                &quot;Name&quot;: &quot;My New Place&quot;,
                                &quot;ImageUrl&quot;: &quot;http://lorempixel.com/400/200/cats&quot;,
                                &quot;Url&quot;: &quot;https://example.com&quot;,
                                &quot;Description&quot;: &quot;A great place to visit!&quot;,
                                &quot;Latitude&quot;: 34.0784796,
                                &quot;Longitude&quot;: -107.6184694,
                                &quot;Address&quot;: &quot;123 W Main St&quot;,
                                &quot;City&quot;: &quot;Citytown&quot;,
                                &quot;State&quot;: &quot;NM&quot;,
                                &quot;ZipCode&quot;: &quot;54321&quot;,
                                &quot;Phone&quot;: 555-555-1234,
                                &quot;Country&quot;: &quot;US&quot;,
                                &quot;IsActive&quot;: true
                            }
                        ],
                    }
                ],
            }
        ],
        &quot;SecondaryLogoUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/link-content/companyLogo/13551d3417bd481883931d9d8ff054aa.jpg&quot;
    }```--&gt;
    @param {object} variables - Variables used for this request
    @param {String} variables.baseApiUrl
    @param {String} variables.tripId
    @param {String} variables.platformPublicKey
    @param {Function} callback - Callback function to return response (err, res)
    */
    "updateTrip": (variables, callback) => {
      if (typeof variables === 'function') {
        callback = variables;
        variables = {};
      }
      let baseApiUrl = variables.baseApiUrl || self.variables.baseApiUrl || '';
      let tripId = variables.tripId || self.variables.tripId || '';
      let platformPublicKey = variables.platformPublicKey || self.variables.platformPublicKey || '';
      var options = {
        'method': 'PUT',
        'url': '' + baseApiUrl + '/api/v1/trips/' + tripId + '',
        'headers': {
          'X-USER-TOKEN': '{{user-access-token}}',
          'X-API-PUBLIC-KEY': '' + platformPublicKey + '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "Name": "Updated {{$timestamp}}",
          "InviteMessage": "Welcome to your trip!",
          "TripDays": [{
            "Title": "Updated {{$timestamp}}",
            "Date": "3/21/2016",
            "TripEvents": [{
              "Name": "Updated {{$timestamp}}",
              "SegmentProviderName": "Lincoln Grand Hotel",
              "SegmentProviderPhone": "555-867-5309",
              "SegmentProviderUrl": "https://lincolngrandhotel.com",
              "SegmentIdentifier": "YP02XVDB",
              "CurrencyCode": "USD",
              "PriceInCents": 13579,
              "EventType": 1,
              "IsEndingEvent": true,
              "TripIdeas": [{
                "Name": "My New Place",
                "ImageUrl": "http://lorempixel.com/400/200/cats",
                "Url": "https://example.com",
                "Description": "A great place to visit!",
                "Latitude": 34.0784796,
                "Longitude": -107.6184694,
                "Address": "123 W Main St",
                "City": "Citytown",
                "State": "NM",
                "ZipCode": 87825,
                "Country": "US"
              }]
            }]
          }]
        })

      };
      request(options, function(error, response) {
        return callback(error, response);
      });
    },
    /**
    Archives the `Trip`.

    &lt;!--### Sample Response
    ```
    {
        &quot;Id&quot;: 1234,
        &quot;VerificationKey&quot;: xxxxxxxxxxxx,
        &quot;Name&quot;: &quot;Updated 1491423686&quot;,
        &quot;Active&quot;: true,
        &quot;CreatedOn&quot;: &quot;2017-04-05T20:21:22.4826361Z&quot;,
        &quot;InviteMessage&quot;: &quot;Welcome to your trip!&quot;,
        &quot;TripCoverPhotoUrl&quot;: &quot;http://lorempixel.com/400/200/cats/&quot;,
        &quot;EstimatedCost&quot;: $1,234,
        &quot;IsCostPerPerson&quot;: true,
        &quot;SecondaryLogoUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/link-content/companyLogo/13551d3417bd481883931d9d8ff054aa.jpg&quot;,
        &quot;IsArchived&quot;: true
    }```--&gt;
    @param {object} variables - Variables used for this request
    @param {String} variables.baseApiUrl
    @param {String} variables.tripId
    @param {String} variables.platformPublicKey
    @param {Function} callback - Callback function to return response (err, res)
    */
    "archiveTrip": (variables, callback) => {
      if (typeof variables === 'function') {
        callback = variables;
        variables = {};
      }
      let baseApiUrl = variables.baseApiUrl || self.variables.baseApiUrl || '';
      let tripId = variables.tripId || self.variables.tripId || '';
      let platformPublicKey = variables.platformPublicKey || self.variables.platformPublicKey || '';
      var options = {
        'method': 'DELETE',
        'url': '' + baseApiUrl + '/api/v1/trips/' + tripId + '',
        'headers': {
          'X-USER-TOKEN': '{{user-access-token}}',
          'X-API-PUBLIC-KEY': '' + platformPublicKey + '',
          'Content-Type': 'application/json'
        }
      };
      request(options, function(error, response) {
        return callback(error, response);
      });
    }
  };

  /**
  A `TripDay` represents a day on the itinerary.  It may have a date (e.g. 2017/01/24) or may not (e.g. Day 2).

  NOTE: You must supply the `X-TRIP-ID` header with the  `TripId` from the created `Trip` for all of these calls.
  */
  this.tripDays = {
    /**
    Create a `TripDay` on a given `Trip`.

    NOTE: You must supply the `X-TRIP-ID` header with the  `TripId` from the created `Trip`.

    &lt;!--### Sample Response

    ```
    {
      &quot;Id&quot;: 654321,
      &quot;TripId&quot;: 10002,
      &quot;Title&quot;: &quot;Trip Day 1491424870&quot;,
      &quot;Date&quot;: &quot;2017-01-15T00:00:00&quot;,
      &quot;Ordinal&quot;: 0.75,
      &quot;IsActive&quot;: true,
      &quot;CreatedOn&quot;: &quot;2017-04-05T20:41:07.0284278Z&quot;,
      &quot;TripEvents&quot;: null
    }```--&gt;
    @param {object} variables - Variables used for this request
    @param {String} variables.baseApiUrl
    @param {String} variables.platformPublicKey
    @param {String} variables.tripId
    @param {Function} callback - Callback function to return response (err, res)
    */
    "createTripDay": (variables, callback) => {
      if (typeof variables === 'function') {
        callback = variables;
        variables = {};
      }
      let baseApiUrl = variables.baseApiUrl || self.variables.baseApiUrl || '';
      let platformPublicKey = variables.platformPublicKey || self.variables.platformPublicKey || '';
      let tripId = variables.tripId || self.variables.tripId || '';
      var options = {
        'method': 'POST',
        'url': '' + baseApiUrl + '/api/v1/tripDays/',
        'headers': {
          'X-USER-TOKEN': '{{user-access-token}}',
          'X-API-PUBLIC-KEY': '' + platformPublicKey + '',
          'X-TRIP-ID': '' + tripId + '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "Title": "Trip Day {{$timestamp}}",
          "TripId": "' + tripId + '",
          "Date": "2017/01/15"
        })

      };
      request(options, function(error, response) {
        return callback(error, response);
      });
    },
    /**
    Get all the `TripDay`s for this `Trip`.

    NOTE: You must supply the `X-TRIP-ID` header with the  `TripId` from the created `Trip`.

    &lt;!--### Sample Response

    ```
    [
      {
        &quot;Id&quot;: 654321,
        &quot;TripId&quot;: 10002,
        &quot;Title&quot;: &quot;Updated 1491424553&quot;,
        &quot;Date&quot;: &quot;2016-03-21T00:00:00&quot;,
        &quot;Ordinal&quot;: 0.5,
        &quot;IsActive&quot;: true,
        &quot;CreatedOn&quot;: &quot;2017-04-05T20:21:22.513&quot;,
        &quot;TripEvents&quot;: null
      },
      {
        &quot;Id&quot;: 543210,
        &quot;TripId&quot;: 10002,
        &quot;Title&quot;: &quot;Trip Day 1491424870&quot;,
        &quot;Date&quot;: &quot;2017-01-15T00:00:00&quot;,
        &quot;Ordinal&quot;: 0.75,
        &quot;IsActive&quot;: true,
        &quot;CreatedOn&quot;: &quot;2017-04-05T20:41:07.0284278Z&quot;,
        &quot;TripEvents&quot;: null
      }
    ]```--&gt;
    @param {object} variables - Variables used for this request
    @param {String} variables.baseApiUrl
    @param {String} variables.platformPublicKey
    @param {String} variables.tripId
    @param {Function} callback - Callback function to return response (err, res)
    */
    "getTripDays": (variables, callback) => {
      if (typeof variables === 'function') {
        callback = variables;
        variables = {};
      }
      let baseApiUrl = variables.baseApiUrl || self.variables.baseApiUrl || '';
      let platformPublicKey = variables.platformPublicKey || self.variables.platformPublicKey || '';
      let tripId = variables.tripId || self.variables.tripId || '';
      var options = {
        'method': 'GET',
        'url': '' + baseApiUrl + '/api/v1/tripDays/',
        'headers': {
          'X-USER-TOKEN': '{{user-access-token}}',
          'X-API-PUBLIC-KEY': '' + platformPublicKey + '',
          'X-TRIP-ID': '' + tripId + ''
        }
      };
      request(options, function(error, response) {
        return callback(error, response);
      });
    },
    /**
    Get the specified `TripDay`.

    NOTE: You must supply the `X-TRIP-ID` header with the  `TripId` from the created `Trip`.

    &lt;!--### Sample Response

    ```
    {
      &quot;Id&quot;: 654321,
      &quot;TripId&quot;: 10002,
      &quot;Title&quot;: &quot;Trip Day 1491424870&quot;,
      &quot;Date&quot;: &quot;2017-01-15T00:00:00&quot;,
      &quot;Ordinal&quot;: 0.75,
      &quot;IsActive&quot;: true,
      &quot;CreatedOn&quot;: &quot;2017-04-05T20:41:07.0284278Z&quot;,
      &quot;TripEvents&quot;: null
    }```--&gt;
    @param {object} variables - Variables used for this request
    @param {String} variables.baseApiUrl
    @param {String} variables.tripDayId
    @param {String} variables.platformPublicKey
    @param {String} variables.tripId
    @param {Function} callback - Callback function to return response (err, res)
    */
    "getTripDay": (variables, callback) => {
      if (typeof variables === 'function') {
        callback = variables;
        variables = {};
      }
      let baseApiUrl = variables.baseApiUrl || self.variables.baseApiUrl || '';
      let tripDayId = variables.tripDayId || self.variables.tripDayId || '';
      let platformPublicKey = variables.platformPublicKey || self.variables.platformPublicKey || '';
      let tripId = variables.tripId || self.variables.tripId || '';
      var options = {
        'method': 'GET',
        'url': '' + baseApiUrl + '/api/v1/tripDays/' + tripDayId + '',
        'headers': {
          'X-USER-TOKEN': '{{user-access-token}}',
          'X-API-PUBLIC-KEY': '' + platformPublicKey + '',
          'X-TRIP-ID': '' + tripId + ''
        }
      };
      request(options, function(error, response) {
        return callback(error, response);
      });
    },
    /**
    Update the specified `TripDay`.

    NOTE: You must supply the `X-TRIP-ID` header with the  `TripId` from the created `Trip`.

    &lt;!--### Sample Response

    ```
    {
      &quot;Id&quot;: 654321,
      &quot;TripId&quot;: 10002,
      &quot;Title&quot;: &quot;Updated Trip Day 1491425270&quot;,
      &quot;Date&quot;: &quot;2016-02-15T00:00:00&quot;,
      &quot;Ordinal&quot;: 0.25,
      &quot;IsActive&quot;: true,
      &quot;CreatedOn&quot;: &quot;2017-04-05T20:41:07.027&quot;,
      &quot;TripEvents&quot;: null
    }```--&gt;
    @param {object} variables - Variables used for this request
    @param {String} variables.baseApiUrl
    @param {String} variables.tripDayId
    @param {String} variables.platformPublicKey
    @param {String} variables.tripId
    @param {Function} callback - Callback function to return response (err, res)
    */
    "updateTripDay-": (variables, callback) => {
      if (typeof variables === 'function') {
        callback = variables;
        variables = {};
      }
      let baseApiUrl = variables.baseApiUrl || self.variables.baseApiUrl || '';
      let tripDayId = variables.tripDayId || self.variables.tripDayId || '';
      let platformPublicKey = variables.platformPublicKey || self.variables.platformPublicKey || '';
      let tripId = variables.tripId || self.variables.tripId || '';
      var options = {
        'method': 'PUT',
        'url': '' + baseApiUrl + '/api/v1/tripDays/' + tripDayId + '',
        'headers': {
          'X-USER-TOKEN': '{{user-access-token}}',
          'X-API-PUBLIC-KEY': '' + platformPublicKey + '',
          'X-TRIP-ID': '' + tripId + '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "Title": "Updated Trip Day {{$timestamp}}",
          "TripId": "' + tripId + '",
          "Date": "2016/02/15",
          "IsActive": true
        })

      };
      request(options, function(error, response) {
        return callback(error, response);
      });
    },
    /**
    Delete the specified `TripDay`.

    NOTE: You must supply the `X-TRIP-ID` header with the  `TripId` from the created `Trip`.

    &lt;!--### Sample Response

    ```
    {
      &quot;Id&quot;: 654321,
      &quot;TripId&quot;: 10002,
      &quot;Title&quot;: &quot;Updated Trip Day 1491425270&quot;,
      &quot;Date&quot;: &quot;2016-02-15T00:00:00&quot;,
      &quot;Ordinal&quot;: 0.25,
      &quot;IsActive&quot;: false,
      &quot;CreatedOn&quot;: &quot;2017-04-05T20:41:07.027&quot;,
      &quot;TripEvents&quot;: null
    }```--&gt;
    @param {object} variables - Variables used for this request
    @param {String} variables.baseApiUrl
    @param {String} variables.tripDayId
    @param {String} variables.platformPublicKey
    @param {String} variables.tripId
    @param {Function} callback - Callback function to return response (err, res)
    */
    "deleteTripDay": (variables, callback) => {
      if (typeof variables === 'function') {
        callback = variables;
        variables = {};
      }
      let baseApiUrl = variables.baseApiUrl || self.variables.baseApiUrl || '';
      let tripDayId = variables.tripDayId || self.variables.tripDayId || '';
      let platformPublicKey = variables.platformPublicKey || self.variables.platformPublicKey || '';
      let tripId = variables.tripId || self.variables.tripId || '';
      var options = {
        'method': 'DELETE',
        'url': '' + baseApiUrl + '/api/v1/tripDays/' + tripDayId + '',
        'headers': {
          'X-USER-TOKEN': '{{user-access-token}}',
          'X-API-PUBLIC-KEY': '' + platformPublicKey + '',
          'X-TRIP-ID': '' + tripId + ''
        }
      };
      request(options, function(error, response) {
        return callback(error, response);
      });
    }
  };

  /**
  A `TripUser` represents a `User` on a `Trip`.  `TripUsers` can be invited to a trip and have different roles depending on your subscription level.  Here are the available Roles:

  | Role   |      Value      |  Notes |
  |----------|-------------|------|
  | Default |  `0` ( `null`) | Defaults to `ItineraryViewOnly` |
  | Organizer |  `1` | Has full control of the `Trip` and `TripUsers` on it |
  | Uninvited |  `2` | Cannot view or access the `Trip` |
  | Collaborator |  `3` | Can help build the itinerary and edit things on the itinerary, change `Trip` information, but can&#39;t cancel the `Trip` or invite others |
  | ItineraryViewOnly |  `4` | Can only view the shared itinerary and has no edit abilities |

  Available operations:
  - Invite 1 or more `TripUsers`
  - Retrieve a single `TripUser`
  - Retrieve all of the `TripUsers` for a `Trip`
  - Update the role of a single `TripUser`
  - Update the roles of multiple `TripUsers`
  - Remove a `TripUser` which moves them to the `Uninvited` Role

  NOTE: You must supply the `X-TRIP-ID` header with the `TripId` from the created `Trip` and it must match the `tripId` in the URI.  The `TripUser` endpoints use a slightly different URL structure than other `Trip` resources.  We will likely move to this type of structure in the future for all `Trip` resources.  We will version the API or allow the old style rather than making breaking changes to existing calls.

  */
  this.tripUsers = {
    /**
    Create (invite) 1 or more `TripUsers` to a `Trip`.  `FullName` and `UserName` (email) are required.

    Currently, this will not send an invite email to them, so you will need to notify them to check their trips list if needed.

    NOTE: You cannot invite anyone in the `Organizer` Role.

    NOTE: You must supply the `X-TRIP-ID` header with the `TripId` from the created `Trip` and it must match the `tripId` in the URI.

    &lt;!--### SAMPLE RESPONSE

    ```[
        {
            &quot;Id&quot;: 123,
            &quot;TripId&quot;: 12345,
            &quot;UserId&quot;: 67890,
            &quot;Role&quot;: 4,
            &quot;User&quot;: {
                &quot;Id&quot;: 67890,
                &quot;FullName&quot;: &quot;readonly 1500310460&quot;,
                &quot;ImageUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/content/default-7.gif&quot;,
                &quot;Username&quot;: &quot;readonly+1500310460@example.com&quot;,
                &quot;IsAgent&quot;: false,
                &quot;SubscriptionPeriodEnd&quot;: null,
                &quot;AgentSubscriptionIsActive&quot;: false,
                &quot;Title&quot;: null,
                &quot;Phone&quot;: null,
                &quot;Url&quot;: null,
                &quot;CompanyLogoUrl&quot;: null
            }
        },
        {
            &quot;Id&quot;: 124,
            &quot;TripId&quot;: 12345,
            &quot;UserId&quot;: 67891,
            &quot;Role&quot;: 4,
            &quot;User&quot;: {
                &quot;Id&quot;: 67891,
                &quot;FullName&quot;: &quot;default 1500310460&quot;,
                &quot;ImageUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/content/default-7.gif&quot;,
                &quot;Username&quot;: &quot;default+1500310460@example.com&quot;,
                &quot;IsAgent&quot;: false,
                &quot;SubscriptionPeriodEnd&quot;: null,
                &quot;AgentSubscriptionIsActive&quot;: false,
                &quot;Title&quot;: null,
                &quot;Phone&quot;: null,
                &quot;Url&quot;: null,
                &quot;CompanyLogoUrl&quot;: null
            }
        },
        {
            &quot;Id&quot;: 125,
            &quot;TripId&quot;: 12345,
            &quot;UserId&quot;: 67892,
            &quot;Role&quot;: 3,
            &quot;User&quot;: {
                &quot;Id&quot;: 67892,
                &quot;FullName&quot;: &quot;collaborator 1500310460&quot;,
                &quot;ImageUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/content/default-6.gif&quot;,
                &quot;Username&quot;: &quot;collaborator+1500310460@example.com&quot;,
                &quot;IsAgent&quot;: false,
                &quot;SubscriptionPeriodEnd&quot;: null,
                &quot;AgentSubscriptionIsActive&quot;: false,
                &quot;Title&quot;: null,
                &quot;Phone&quot;: null,
                &quot;Url&quot;: null,
                &quot;CompanyLogoUrl&quot;: null
            }
        }
    ]```--&gt;
    @param {object} variables - Variables used for this request
    @param {String} variables.baseApiUrl
    @param {String} variables.tripId
    @param {String} variables.platformPublicKey
    @param {Function} callback - Callback function to return response (err, res)
    */
    "createTripusers": (variables, callback) => {
      if (typeof variables === 'function') {
        callback = variables;
        variables = {};
      }
      let baseApiUrl = variables.baseApiUrl || self.variables.baseApiUrl || '';
      let tripId = variables.tripId || self.variables.tripId || '';
      let platformPublicKey = variables.platformPublicKey || self.variables.platformPublicKey || '';
      var options = {
        'method': 'POST',
        'url': '' + baseApiUrl + '/api/v1/trips/' + tripId + '/tripUsers/invite',
        'headers': {
          'X-USER-TOKEN': '{{user-access-token}}',
          'X-API-PUBLIC-KEY': '' + platformPublicKey + '',
          'Content-Type': 'application/json',
          'X-TRIP-ID': '' + tripId + ''
        },
        body: JSON.stringify({
          "tripUsers": [{
            "email": "readonly+{{$timestamp}}@example.com",
            "fullName": "readonly {{$timestamp}}",
            "role": "4"
          }, {
            "email": "collaborator+{{$timestamp}}@example.com",
            "fullName": "collaborator {{$timestamp}}",
            "role": "3"
          }, {
            "email": "default+{{$timestamp}}@example.com",
            "fullName": "default {{$timestamp}}",
            "role": "0"
          }]
        })

      };
      request(options, function(error, response) {
        return callback(error, response);
      });
    },
    /**
    Retreive a given `TripUser`.

    NOTE: You must supply the `X-TRIP-ID` header with the `TripId` from the created `Trip` and it must match the `tripId` in the URI.

    &lt;!--### SAMPLE RESPONSE

    ```{
        &quot;Id&quot;: 123,
        &quot;TripId&quot;: 12345,
        &quot;UserId&quot;: 67890,
        &quot;Role&quot;: 4,
        &quot;User&quot;: {
            &quot;Id&quot;: 112233,
            &quot;FullName&quot;: &quot;readonly 1500310460&quot;,
            &quot;ImageUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/content/default-7.gif&quot;,
            &quot;Username&quot;: &quot;readonly+1500310460@example.com&quot;,
            &quot;IsAgent&quot;: false,
            &quot;SubscriptionPeriodEnd&quot;: null,
            &quot;AgentSubscriptionIsActive&quot;: false,
            &quot;Title&quot;: null,
            &quot;Phone&quot;: null,
            &quot;Url&quot;: null,
            &quot;CompanyLogoUrl&quot;: null
        }
    }```--&gt;
    @param {object} variables - Variables used for this request
    @param {String} variables.baseApiUrl
    @param {String} variables.tripId
    @param {String} variables.platformPublicKey
    @param {Function} callback - Callback function to return response (err, res)
    */
    "getTripuser": (variables, callback) => {
      if (typeof variables === 'function') {
        callback = variables;
        variables = {};
      }
      let baseApiUrl = variables.baseApiUrl || self.variables.baseApiUrl || '';
      let tripId = variables.tripId || self.variables.tripId || '';
      let platformPublicKey = variables.platformPublicKey || self.variables.platformPublicKey || '';
      var options = {
        'method': 'GET',
        'url': '' + baseApiUrl + '/api/v1/trips/' + tripId + '/tripUsers/{{trip-userId}}',
        'headers': {
          'X-USER-TOKEN': '{{user-access-token}}',
          'X-API-PUBLIC-KEY': '' + platformPublicKey + '',
          'X-TRIP-ID': '' + tripId + ''
        }
      };
      request(options, function(error, response) {
        return callback(error, response);
      });
    },
    /**
    Retreive all `TripUsers` on a `Trip`.

    NOTE: You must supply the `X-TRIP-ID` header with the `TripId` from the created `Trip` and it must match the `tripId` in the URI.

    &lt;!--### SAMPLE RESPONSE

    ```[
        {
            &quot;Id&quot;: 123,
            &quot;TripId&quot;: 12345,
            &quot;UserId&quot;: 67890,
            &quot;Role&quot;: 1,
            &quot;User&quot;: {
                &quot;Id&quot;: 67890,
                &quot;FullName&quot;: &quot;Agent Level 1 User&quot;,
                &quot;ImageUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/content/default-4.gif&quot;,
                &quot;Username&quot;: &quot;agent1.1500310214@example.com&quot;,
                &quot;IsAgent&quot;: true,
                &quot;SubscriptionPeriodEnd&quot;: &quot;2019-10-10T00:00:00&quot;,
                &quot;AgentSubscriptionIsActive&quot;: true,
                &quot;Title&quot;: &quot;Travel Expert&quot;,
                &quot;Phone&quot;: &quot;555-555-1234&quot;,
                &quot;Url&quot;: &quot;https://travefy.com/&quot;,
                &quot;CompanyLogoUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/link-content/companyLogo/13551d3417bd481883931d9d8ff054aa.jpg&quot;
            }
        },
        {
            &quot;Id&quot;: 12346,
            &quot;TripId&quot;: 12345,
            &quot;UserId&quot;: 67891,
            &quot;Role&quot;: 4,
            &quot;User&quot;: {
                &quot;Id&quot;: 67891,
                &quot;FullName&quot;: &quot;Cameron Example&quot;,
                &quot;ImageUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/content/default-5.gif&quot;,
                &quot;Username&quot;: &quot;cameron@example.com&quot;,
                &quot;IsAgent&quot;: false,
                &quot;SubscriptionPeriodEnd&quot;: null,
                &quot;AgentSubscriptionIsActive&quot;: false,
                &quot;Title&quot;: null,
                &quot;Phone&quot;: null,
                &quot;Url&quot;: null,
                &quot;CompanyLogoUrl&quot;: null
            }
        },
        {
            &quot;Id&quot;: 125,
            &quot;TripId&quot;: 12345,
            &quot;UserId&quot;: 67892,
            &quot;Role&quot;: 4,
            &quot;User&quot;: {
                &quot;Id&quot;: 67892,
                &quot;FullName&quot;: &quot;Default Example&quot;,
                &quot;ImageUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/content/default-5.gif&quot;,
                &quot;Username&quot;: &quot;default@example.com&quot;,
                &quot;IsAgent&quot;: false,
                &quot;SubscriptionPeriodEnd&quot;: null,
                &quot;AgentSubscriptionIsActive&quot;: false,
                &quot;Title&quot;: null,
                &quot;Phone&quot;: null,
                &quot;Url&quot;: null,
                &quot;CompanyLogoUrl&quot;: null
            }
        },
        {
            &quot;Id&quot;: 126,
            &quot;TripId&quot;: 12345,
            &quot;UserId&quot;: 67893,
            &quot;Role&quot;: 3,
            &quot;User&quot;: {
                &quot;Id&quot;: 67893,
                &quot;FullName&quot;: &quot;Collaborator Example&quot;,
                &quot;ImageUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/content/default-9.gif&quot;,
                &quot;Username&quot;: &quot;collaborator@example.com&quot;,
                &quot;IsAgent&quot;: false,
                &quot;SubscriptionPeriodEnd&quot;: null,
                &quot;AgentSubscriptionIsActive&quot;: false,
                &quot;Title&quot;: null,
                &quot;Phone&quot;: null,
                &quot;Url&quot;: null,
                &quot;CompanyLogoUrl&quot;: null
            }
        },
        {
            &quot;Id&quot;: 127,
            &quot;TripId&quot;: 12345,
            &quot;UserId&quot;: 67894,
            &quot;Role&quot;: 4,
            &quot;User&quot;: {
                &quot;Id&quot;: 67894,
                &quot;FullName&quot;: &quot;readonly 1500310460&quot;,
                &quot;ImageUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/content/default-7.gif&quot;,
                &quot;Username&quot;: &quot;readonly+1500310460@example.com&quot;,
                &quot;IsAgent&quot;: false,
                &quot;SubscriptionPeriodEnd&quot;: null,
                &quot;AgentSubscriptionIsActive&quot;: false,
                &quot;Title&quot;: null,
                &quot;Phone&quot;: null,
                &quot;Url&quot;: null,
                &quot;CompanyLogoUrl&quot;: null
            }
        },
        {
            &quot;Id&quot;: 128,
            &quot;TripId&quot;: 12345,
            &quot;UserId&quot;: 67895,
            &quot;Role&quot;: 4,
            &quot;User&quot;: {
                &quot;Id&quot;: 67895,
                &quot;FullName&quot;: &quot;default 1500310460&quot;,
                &quot;ImageUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/content/default-7.gif&quot;,
                &quot;Username&quot;: &quot;default+1500310460@example.com&quot;,
                &quot;IsAgent&quot;: false,
                &quot;SubscriptionPeriodEnd&quot;: null,
                &quot;AgentSubscriptionIsActive&quot;: false,
                &quot;Title&quot;: null,
                &quot;Phone&quot;: null,
                &quot;Url&quot;: null,
                &quot;CompanyLogoUrl&quot;: null
            }
        },
        {
            &quot;Id&quot;: 129,
            &quot;TripId&quot;: 12345,
            &quot;UserId&quot;: 67899,
            &quot;Role&quot;: 3,
            &quot;User&quot;: {
                &quot;Id&quot;: 67899,
                &quot;FullName&quot;: &quot;collaborator 1500310460&quot;,
                &quot;ImageUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/content/default-6.gif&quot;,
                &quot;Username&quot;: &quot;collaborator+1500310460@example.com&quot;,
                &quot;IsAgent&quot;: false,
                &quot;SubscriptionPeriodEnd&quot;: null,
                &quot;AgentSubscriptionIsActive&quot;: false,
                &quot;Title&quot;: null,
                &quot;Phone&quot;: null,
                &quot;Url&quot;: null,
                &quot;CompanyLogoUrl&quot;: null
            }
        }
    ]```--&gt;
    @param {object} variables - Variables used for this request
    @param {String} variables.baseApiUrl
    @param {String} variables.tripId
    @param {String} variables.platformPublicKey
    @param {Function} callback - Callback function to return response (err, res)
    */
    "getTripusers": (variables, callback) => {
      if (typeof variables === 'function') {
        callback = variables;
        variables = {};
      }
      let baseApiUrl = variables.baseApiUrl || self.variables.baseApiUrl || '';
      let tripId = variables.tripId || self.variables.tripId || '';
      let platformPublicKey = variables.platformPublicKey || self.variables.platformPublicKey || '';
      var options = {
        'method': 'GET',
        'url': '' + baseApiUrl + '/api/v1/trips/' + tripId + '/tripUsers',
        'headers': {
          'X-USER-TOKEN': '{{user-access-token}}',
          'X-API-PUBLIC-KEY': '' + platformPublicKey + '',
          'X-TRIP-ID': '' + tripId + ''
        }
      };
      request(options, function(error, response) {
        return callback(error, response);
      });
    },
    /**
    Update the Role of a given `TripUser` on a `Trip`.

    NOTE: You cannot update anyone to the `Organizer` Role.  You cannot change the Role of an existing `Organizer`.

    NOTE: You must supply the `X-TRIP-ID` header with the `TripId` from the created `Trip` and it must match the `tripId` in the URI.

    &lt;!--### SAMPLE RESPONSE

    ```{
        &quot;Id&quot;: 123,
        &quot;TripId&quot;: 12345,
        &quot;UserId&quot;: 67890,
        &quot;Role&quot;: 4,
        &quot;User&quot;: {
            &quot;Id&quot;: 67890,
            &quot;FullName&quot;: &quot;readonly 1500310460&quot;,
            &quot;ImageUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/content/default-7.gif&quot;,
            &quot;Username&quot;: &quot;readonly+1500310460@example.com&quot;,
            &quot;IsAgent&quot;: false,
            &quot;SubscriptionPeriodEnd&quot;: null,
            &quot;AgentSubscriptionIsActive&quot;: false,
            &quot;Title&quot;: null,
            &quot;Phone&quot;: null,
            &quot;Url&quot;: null,
            &quot;CompanyLogoUrl&quot;: null
        }
    }```--&gt;
    @param {object} variables - Variables used for this request
    @param {String} variables.baseApiUrl
    @param {String} variables.tripId
    @param {String} variables.tripUserId
    @param {String} variables.platformPublicKey
    @param {Function} callback - Callback function to return response (err, res)
    */
    "updateTripuser": (variables, callback) => {
      if (typeof variables === 'function') {
        callback = variables;
        variables = {};
      }
      let baseApiUrl = variables.baseApiUrl || self.variables.baseApiUrl || '';
      let tripId = variables.tripId || self.variables.tripId || '';
      let tripUserId = variables.tripUserId || self.variables.tripUserId || '';
      let platformPublicKey = variables.platformPublicKey || self.variables.platformPublicKey || '';
      var options = {
        'method': 'PUT',
        'url': '' + baseApiUrl + '/api/v1/trips/' + tripId + '/tripUsers/' + tripUserId + '',
        'headers': {
          'X-USER-TOKEN': '{{user-access-token}}',
          'X-API-PUBLIC-KEY': '' + platformPublicKey + '',
          'Content-Type': 'application/json',
          'X-TRIP-ID': '' + tripId + ''
        },
        body: JSON.stringify({
          "role": 4
        })

      };
      request(options, function(error, response) {
        return callback(error, response);
      });
    },
    /**
    Update the Roles of multiple `TripUsers` on a `Trip`.

    NOTE: You cannot update anyone to the `Organizer` Role.  You cannot change the Role of an existing `Organizer`.

    NOTE: You must supply the `X-TRIP-ID` header with the `TripId` from the created `Trip` and it must match the `tripId` in the URI.

    &lt;!--### SAMPLE RESPONSE

    ```[
        {
            &quot;Id&quot;: 123,
            &quot;TripId&quot;: 12345,
            &quot;UserId&quot;: 67890,
            &quot;Role&quot;: 3,
            &quot;User&quot;: {
                &quot;Id&quot;: 67890,
                &quot;FullName&quot;: &quot;readonly 1500310460&quot;,
                &quot;ImageUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/content/default-7.gif&quot;,
                &quot;Username&quot;: &quot;readonly+1500310460@example.com&quot;,
                &quot;IsAgent&quot;: false,
                &quot;SubscriptionPeriodEnd&quot;: null,
                &quot;AgentSubscriptionIsActive&quot;: false,
                &quot;Title&quot;: null,
                &quot;Phone&quot;: null,
                &quot;Url&quot;: null,
                &quot;CompanyLogoUrl&quot;: null
            }
        },
        {
            &quot;Id&quot;: 124,
            &quot;TripId&quot;: 12345,
            &quot;UserId&quot;: 67891,
            &quot;Role&quot;: 2,
            &quot;User&quot;: {
                &quot;Id&quot;: 67891,
                &quot;FullName&quot;: &quot;default 1500310460&quot;,
                &quot;ImageUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/content/default-7.gif&quot;,
                &quot;Username&quot;: &quot;default+1500310460@example.com&quot;,
                &quot;IsAgent&quot;: false,
                &quot;SubscriptionPeriodEnd&quot;: null,
                &quot;AgentSubscriptionIsActive&quot;: false,
                &quot;Title&quot;: null,
                &quot;Phone&quot;: null,
                &quot;Url&quot;: null,
                &quot;CompanyLogoUrl&quot;: null
            }
        }
    ]```--&gt;
    @param {object} variables - Variables used for this request
    @param {String} variables.baseApiUrl
    @param {String} variables.tripId
    @param {String} variables.platformPublicKey
    @param {Function} callback - Callback function to return response (err, res)
    */
    "updateTripusers": (variables, callback) => {
      if (typeof variables === 'function') {
        callback = variables;
        variables = {};
      }
      let baseApiUrl = variables.baseApiUrl || self.variables.baseApiUrl || '';
      let tripId = variables.tripId || self.variables.tripId || '';
      let platformPublicKey = variables.platformPublicKey || self.variables.platformPublicKey || '';
      var options = {
        'method': 'POST',
        'url': '' + baseApiUrl + '/api/v1/trips/' + tripId + '/tripUsers/update',
        'headers': {
          'X-USER-TOKEN': '{{user-access-token}}',
          'X-API-PUBLIC-KEY': '' + platformPublicKey + '',
          'Content-Type': 'application/json',
          'X-TRIP-ID': '' + tripId + ''
        },
        body: JSON.stringify({
          "tripUsers": [{
            "id": "{{trip-userId}}",
            "role": "3"
          }, {
            "id": "{{trip-user-id2}}",
            "role": "2"
          }]
        })

      };
      request(options, function(error, response) {
        return callback(error, response);
      });
    },
    /**
    Delete (uninvite) a given `TripUser` on a `Trip`.

    NOTE: You cannot remove anyone in the `Organizer` Role.

    NOTE: You must supply the `X-TRIP-ID` header with the `TripId` from the created `Trip` and it must match the `tripId` in the URI.

    &lt;!--### SAMPLE RESPONSE

    ```{
        &quot;Id&quot;: 123,
        &quot;TripId&quot;: 12345,
        &quot;UserId&quot;: 67890,
        &quot;Role&quot;: 2,
        &quot;User&quot;: {
            &quot;Id&quot;: 67890,
            &quot;FullName&quot;: &quot;readonly 1500310460&quot;,
            &quot;ImageUrl&quot;: &quot;https://s3.amazonaws.com/travefy-storage/content/default-7.gif&quot;,
            &quot;Username&quot;: &quot;readonly+1500310460@example.com&quot;,
            &quot;IsAgent&quot;: false,
            &quot;SubscriptionPeriodEnd&quot;: null,
            &quot;AgentSubscriptionIsActive&quot;: false,
            &quot;Title&quot;: null,
            &quot;Phone&quot;: null,
            &quot;Url&quot;: null,
            &quot;CompanyLogoUrl&quot;: null
        }
    }```--&gt;
    @param {object} variables - Variables used for this request
    @param {String} variables.baseApiUrl
    @param {String} variables.tripId
    @param {String} variables.tripUserId
    @param {String} variables.platformPublicKey
    @param {Function} callback - Callback function to return response (err, res)
    */
    "removeTripuser": (variables, callback) => {
      if (typeof variables === 'function') {
        callback = variables;
        variables = {};
      }
      let baseApiUrl = variables.baseApiUrl || self.variables.baseApiUrl || '';
      let tripId = variables.tripId || self.variables.tripId || '';
      let tripUserId = variables.tripUserId || self.variables.tripUserId || '';
      let platformPublicKey = variables.platformPublicKey || self.variables.platformPublicKey || '';
      var options = {
        'method': 'DELETE',
        'url': '' + baseApiUrl + '/api/v1/trips/' + tripId + '/tripUsers/' + tripUserId + '',
        'headers': {
          'X-USER-TOKEN': '{{user-access-token}}',
          'X-API-PUBLIC-KEY': '' + platformPublicKey + '',
          'X-TRIP-ID': '' + tripId + ''
        }
      };
      request(options, function(error, response) {
        return callback(error, response);
      });
    }
  };

  this.variables = this.setVariables(config);

}

/**
Method to retrieve current variable.

@param {string} [variable] - Variable name
@returns {Object} object containing variables
*/
SDK.prototype.getVariables = function(variable) {
  return variable ? this.variables[variable] : this.variables;
};

/**
Function to set variables for entire SDK. These variables will override existing/default values.

@param {Object} Object containing env variables
*/
SDK.prototype.setVariables = function(vars) {
  let variables = _.cloneDeep(this.variables || configVariables);
  Object.keys(vars).forEach(function(key) {
    if (configVariables[key]) {
      variables[key] = vars[key];
    } else {
      console.log(`Variable name "${key}" is not being used in the SDK hence not declared.`)
    }
  });
  this.variables = variables;
  return this.variables;
};

module.exports = SDK;