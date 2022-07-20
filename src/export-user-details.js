var AWS = require('aws-sdk');
const fs = require('fs')
const converter = require('json-2-csv');


const getProperty = (attributes, property, defaultValue) => {
    const entry = attributes.find(attribute => attribute.Name == property);
    if (entry) {
        return entry.Value
    }
    return defaultValue;
}


const getUserPayload = (user) => {
    return {
        name: user.Username,

        given_name: getProperty(user.Attributes, 'given_name', ''),
        family_name: getProperty(user.Attributes, 'family_name', ''),
        middle_name: getProperty(user.Attributes, 'middle_name', ''),
        nickname: getProperty(user.Attributes, 'nickname', ''),
        preferred_username: getProperty(user.Attributes, 'preferred_username', ''),
        profile: getProperty(user.Attributes, 'profile', ''),
        picture: getProperty(user.Attributes, 'picture', ''),
        website: getProperty(user.Attributes, 'website', ''),
        email: getProperty(user.Attributes, 'email', ''),
        email_verified: getProperty(user.Attributes, 'email_verified', 'false'),
        gender: getProperty(user.Attributes, 'gender', ''),
        birthdate: getProperty(user.Attributes, 'birthdate', ''),
        zoneinfo: getProperty(user.Attributes, 'zoneinfo', ''),
        locale: getProperty(user.Attributes, 'locale', ''),
        phone_number: getProperty(user.Attributes, 'phone_number', ''),
        phone_number_verified: getProperty(user.Attributes, 'phone_number_verified', 'false'),
        address: getProperty(user.Attributes, 'address', ''),
        updated_at: '',
        'cognito:mfa_enabled': getProperty(user.Attributes, 'cognito:mfa_enabled', 'false'),
        'cognito:username': user.Username

    }
}



const getUsers = () => {
    var params = {
        UserPoolId: 'us-east-1_ABoy0ApId'
    };

    return new Promise((resolve, reject) => {
        AWS.config.update({ region: 'us-east-1', accessKeyId: '<actual access key>', 'secretAccessKey': '<secret key>' });
        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
        cognitoidentityserviceprovider.listUsers(params, (err, data) => {
            if (err) {
                console.log(err);
                reject(err)
            }
            else {
                const usersJson = [];
                data.Users.forEach(user => {
                    usersJson.push(getUserPayload(user))
                })
                console.log("data", usersJson[0]);
                converter.json2csv(usersJson, (err, csv) => {
                    if (err) {
                        throw err;
                    }
                    // print CSV string
                    console.log(csv);
                    // write CSV to a file
                    fs.writeFileSync('user-export.csv', csv);
                });
                resolve(data)
            }
        })
    });
}

getUsers();





/// package.json///


{
    "name": "user-export",
    "version": "1.0.0",
    "description": "exporting users from user pool",
    "main": "server.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "start": "node server.js"
    },
    "author": "",
    "license": "ISC",
    "dependencies": {
      "aws-sdk": "^2.1060.0",
      "json-2-csv": "^3.16.0"
    }
  }
