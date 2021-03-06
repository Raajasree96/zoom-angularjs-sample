define({ "api": [
  {
    "type": "get",
    "url": "/activity/:id",
    "title": "Get Activity Data",
    "name": "Get_Activity_Data",
    "group": "Activity",
    "sampleRequest": [
      {
        "url": "http://localhost:4000/api/activity/NyrIrwv3e"
      }
    ],
    "description": "<p>Fetches the activity data including the DC app data. Fetches the data from SSDS/LS api if activity data not available in DC.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ActivityID of the current session.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ActivityData",
            "description": "<p>Fetches the full dump of activity data including the DC app data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTPS 200 OK\n{\n\t\"id\": \"test\",\n\t\"code\": \"005402\",\n\t\"activityType\": \"EN\",\n\t\"teacher\":\n\t\t{\n\t\t\t\"id\": \"000\",\n\t\t\t\"firstName\": \"XXX\",\n\t\t\t\"lastName\": \"YYY\",\n\t\t\t\"gender\": \"XXXX\"\n\t\t}\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ActivityData",
            "description": "<p>Data Not Found</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTPS 400 Not Found\n{\n\t\"error\" : \"API validation errors found\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/routes/activity.route.js",
    "groupTitle": "Activity"
  },
  {
    "type": "post",
    "url": "/activity/:id/:slot/:delay",
    "title": "Set Activity Data",
    "name": "Set_Activty_Data",
    "group": "Activity",
    "sampleRequest": [
      {
        "url": "http://localhost:4000/api/activity/Eki53DP3g/60/12"
      }
    ],
    "description": "<p>Stores the activity data biased from a sample data into activity id.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Current session activityID.</p>"
          },
          {
            "group": "Parameter",
            "type": "Numeric",
            "optional": false,
            "field": "slot",
            "description": "<p>Session duration in minutes.</p>"
          },
          {
            "group": "Parameter",
            "type": "Numeric",
            "optional": false,
            "field": "delay",
            "description": "<p>Session delay time in minutes, when specified session will start after the delay.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ActivityData",
            "description": "<p>Stores the activity data biased from a sample data into activity id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "\t\tHTTPS 200 OK\n\t\t{\n \t\t\"id\"        : \"78965\",\n \t\t\"startTime\" : \"DD-Mon-YYYY : hr-min-sec\",\n \t\t\"timeLeft\"  : \"60 mins\",\n \t\t\"waitTime\"  : \"6 mins\",\n\t\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Activty",
            "description": "<p>Failed to create Activity</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTPS 404 Not found\n{\n\t\"error\" : \"Failed to create Activity\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTPS 400 Not Found\n{\n\t\"error\" : \"API validation errors found\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/routes/activity.route.js",
    "groupTitle": "Activity"
  },
  {
    "type": "get",
    "url": "/auth/check/:activityId/:userId",
    "title": "Check Activity Data",
    "name": "Check_Activity_Data",
    "group": "Authentication",
    "sampleRequest": [
      {
        "url": "http://localhost:4000/api/auth/check?activityId=Ny5dPAtdx&userId=URAMB"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "activityID",
            "description": "<p>Current session activityID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userID",
            "description": "<p>Unique User ID.</p>"
          }
        ]
      }
    },
    "description": "<p>Validates the authenticity of the user and the activity data to the classroom.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ActivityData",
            "description": "<p>Found in database</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTPS 400 Error\n{\n\t\"error\" : \"Activity not found in database\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTPS 0 Error\n{\n\t\"error\" : \"SSDS API token issue\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTPS 100 Error\n{\n\t\"error\" : \"SSDS Encounter not scheduled\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/routes/auth.route.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "get",
    "url": "/data/settings",
    "title": "Request settings data",
    "name": "settings",
    "group": "Data",
    "sampleRequest": [
      {
        "url": "http://localhost:4000/api/data/settings"
      }
    ],
    "version": "0.0.0",
    "filename": "server/routes/data.route.js",
    "groupTitle": "Data"
  },
  {
    "type": "get",
    "url": "/status/mongo",
    "title": "Request MongoDB status",
    "name": "CheckMongo",
    "group": "Status",
    "sampleRequest": [
      {
        "url": "http://localhost:4000/api/status/mongo"
      }
    ],
    "description": "<p>Checks the Mongo DB connectivity and notifies if the database is connected or not.</p>",
    "version": "0.0.0",
    "filename": "server/routes/status.route.js",
    "groupTitle": "Status"
  },
  {
    "type": "get",
    "url": "/status/redis",
    "title": "Request redis status",
    "name": "CheckRedisAndMongo",
    "group": "Status",
    "sampleRequest": [
      {
        "url": "http://localhost:4000/api/status/redis"
      }
    ],
    "description": "<p>Checks the Redis DB connectivity and notifies if the database is connected or not.</p>",
    "version": "0.0.0",
    "filename": "server/routes/status.route.js",
    "groupTitle": "Status"
  }
] });
