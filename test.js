
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
// const request = require('request');
// const jwkToPem = require('jwk-to-pem');
// const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');

let idToken = 'eyJraWQiOiIrWXM3MWJFMVFnUms5M01od0J6dHkyc2E3WHdBQ3pXT1ljUHJVWFR2b1hrPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJiNGQ0OTc4Ny0zNDA5LTRmYTgtYmVkMC01NzhiM2VjOTc5NDAiLCJhdWQiOiI2aTgwMTYxNWd2NWtrMjlocTNiNjg0ZTlxMSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJldmVudF9pZCI6IjkyYTFlODU0LTA0ZmEtMTFlOS04OGUwLTE1MDliZGY3MjFkNiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTQ1MzgwOTg2LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV81cWJNbXVDUXciLCJjb2duaXRvOnVzZXJuYW1lIjoiamVldmFuMiIsImV4cCI6MTU0NTM4NDU4NiwiaWF0IjoxNTQ1MzgwOTg2LCJlbWFpbCI6ImplZXZhbi5naHVsZTg5QGdtYWlsLmNvbSJ9.jrbpuvAF11qHDTLFTKMnt8yu62St-jPtrP0pOdT_XajSQMyY1YB1vFMgG2520J6izc3t7_DlyanVUcMq9zdB1AyxVA3LOmCdnl67a0vo6HNuN_xFuGHr_pSJdtftKWfwnGs-tjCuWdOLV4o2Rjk5hhfLNNdmTHEMkk6bmJSLXJEzxZlTynaY0khI1NmrTJ70MdXesB6VzVSw0avva14s4L8y-4IhY8smq1Jwgf6g59J2MDbbm1UYPtNGU6XLDBDMfzaGcPYBjcD3sxCoy4G8Fgmo3NgBakHJEClD1fL0gek1WDd65aYKVhWNIA3DgF3o88dETDCD6tDtQBLjh0Uv9w';
let accessToekn = 'eyJraWQiOiJPRjc2RzRnZFJCYThvMDRWWVFuS3ZnQnVsVXBxcDhCdmRBSmxOUVJ4WW5VPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJiNGQ0OTc4Ny0zNDA5LTRmYTgtYmVkMC01NzhiM2VjOTc5NDAiLCJldmVudF9pZCI6IjkyYTFlODU0LTA0ZmEtMTFlOS04OGUwLTE1MDliZGY3MjFkNiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE1NDUzODA5ODYsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xXzVxYk1tdUNRdyIsImV4cCI6MTU0NTM4NDU4NiwiaWF0IjoxNTQ1MzgwOTg2LCJqdGkiOiJmZmNiZDFkOC1iNTg3LTQwNTAtYmExNS04ZWIyZjgwZTMyZTUiLCJjbGllbnRfaWQiOiI2aTgwMTYxNWd2NWtrMjlocTNiNjg0ZTlxMSIsInVzZXJuYW1lIjoiamVldmFuMiJ9.fk4KM9yh75fvySHsK_D4c-EhyaqxQZA9gBj6ZNPBLP7kduRbFpV-IqQIsJXGnrrS7fT2t1PleXsAwzg5YvLsW08RivjUFdRDzg_DHPb_jEGOUdg-hvdTO8R2V2YzVTZcUqCRMyc5S9usxKPSdtsxPaERWSAuyi0J_aqBssZwh_CgZWItudfGkq8icsH-MzT13Uzct1mHgAqWynom0KVupEs7MDSHvSaVUtPl4gmjeSO6zAKU-aGb-kJXJJ5iGESaqvW-ZicCNON_092-dhfxZpFHoBv8pdmhip9JoAYOW4aCD3ghT31XegNXTR1iZlzULFQIwa5ddhNdCIdPCayU1Q';
let refreshToken = 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.Fm1eAt4SAhVrS2dmmRk9_QE23Mn4vXFJXsYMc0z-ZjdgRoIif4MxDIgpX1uFYAdYm0C0r7iVAiBl8iqo5HKB6LemwhtqdUxUtpJJwbAfcd2ANTk9zBZ0ML8UpX1eV3qQAONzAX_jFPCXY6YqcAH14M2BfsiS4iUVu3v9oc1Py5brZ6gxvAhAcjJteZ-akTqhgvW72U9833vIQuUOVuahfsgp1hmtBv6zWfPCSYbgpxig3NzfO4kzIf8moNvDlklsuGAqrc_YaKoQMsfnm6qT18FCzeofrv-25GIj_XaEnovW6rnQynCEdK5i6HTUTM-2ThssBxXdao7Fy0sNX777Aw.I_gRt9cEOAjjB0Nf.2BZDSc_H4JJo-uf19aWHuUcC4rqp-DnDarlryScA6DhFdyWeTLaeW6TkZ--OleRVY5of8uklP5pad12ovfOJB6kMqZwza6CQym_kP9DdH6v6NjvfXgGEb-meaNNDV7GQGJPLXvHF7i1J1puldZjkGR6s2ol56QRspevgoCBazr1Xq6e_Rb-5jq-RgfHrHzGa_RcOcSy-toIswEvXyotjYgA8tCBF4P556dZk2u7Sv6KDTHh19p-cjnz_E6HXtX-7QccwArrwSCPrIf8oeV4HDF01GocthDK627ACoHixysILh1Wf8zZjC4v17-WeH34VGzc0KrDzvimgEJ_voaHXmW5hj5k71uxusBTX4dET-cCA9EBcmzpQx23PsvWEQZrEKRgM2JEf8HFt73RMWTNeIIZCy4foslYp-N9FUHmYDHYQSFCl3pzsrDWS2G4YH7UIgmzeCJVOiMjJpuFInlh46vBCpCcvZfcBvjFHhM4JVWEqe6Jax5vRXA-RNEpxAu4nvRf0ndcVdAm1uyBe6acMygWRE8oYjqXjPirFdTf0noyVZt9wzG4_piPBopX0y0mV53InRHch_TRAjFJdQquWO8ORPrC-DmDvDBUiWU6XGsGgmll8UbNWJmeUtms-6LjOCJgfzneK-jNPFsU87LxQDF6rjR74H4EOnzk5d3KK6zlzIgRvw0YkDU7TUPWleGpFoToozsiDpSb4CVZ7taF0483viqGzBLl2YB2us4u_nccA2YUwGDQ5xUgvCnnf0sg5dzlAyiGMzbKxcP0r5oSGdrxTNgYZR5dJT4Q-MapefZV0dSmSC5_b4a1VimNXHxMYfb8qOUymfn_Rj0r-KQc-ywEZKDTDajEHC2d3axKd9QRpYVi0elq8JphaTFRWeJgSKpO_tXfetXNtvDBIsqjzhEGz1Nim21plGfw22iZpMSrcnyC6StAeag0y8Bb2jlwzgtcbYIeM8ZO3p8tWRnayXdgIkwNNgCoQVFqmfgG1tI8q8yGhJYyS7Zjqx2QMoK0wKBv6GSlqFmY8emjYVSwxwrfxkjL1DqETMPkYIEgYa8Ehj7Hju8P63u1n60yI7BsoVUii_IffmzVuRl5wiyd3_mlBFUycuwh61BEFn95hC9nhWBSERCbRL_OMINBSa-gPxkCxc0GLllSyCUfRxD6pWoxzgdx-MG4HLoNs1QyKd4B-PMJHpXMJ0ndzTbbjN5yYnAK19NXUf03ZT9t0n0XlWPq9gCRwnc9DHRXf9Ogm8w57KLVwugsJTmSE_Ep1leM_Csmhv5C5.0-S1u1xAHhisVE4BRHu5Ow';

const poolData = {
  UserPoolId: "us-east-1_5qbMmuCQw",//"us-east-1_EQDyKB9QH",//"us-east-1_ghA68uMnT",//"us-east-1_CCWuMQaJD", //"us-east-1_sSz1cdGIY", // Your user pool id here    
  ClientId: "6i801615gv5kk29hq3b684e9q1"//"36od9lj3cms84c84714hq3f170",//"5qchngsfrb8sh7hmc97gqsjmaa",//"18me92ka1sv0f3c9u3bo7inoja", // Your client id here
};
const pool_region = 'us-east-1';
const userPool = new CognitoUserPool(poolData);


function changePassword(username, oldPassword, newPassword) {
  let userData = {
    Username: username,
    Pool: userPool
  };
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  let cognitoUserSession = getSession(accessToekn, idToken, refreshToken);
  cognitoUser.setSignInUserSession(cognitoUserSession);

  cognitoUser.changePassword(oldPassword, newPassword, function (err, result) {
    if (err) {
      console.log('call result: ' + err);
      return;
    }
    console.log('call result: ' + result);
  });
}

function getSession(accessToekn, idToken, refreshToken) {
  let CognitoAccessToken = new AmazonCognitoIdentity.CognitoAccessToken({ AccessToken: accessToekn });
  let CognitoIdToken = new AmazonCognitoIdentity.CognitoIdToken({ IdToken: idToken });
  let CognitoRefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({ RefreshToken: refreshToken });
  let sessionData = {

    IdToken: CognitoIdToken,
    RefreshToken: CognitoRefreshToken,
    AccessToken: CognitoAccessToken
  }
  let cognitoUserSession = new AmazonCognitoIdentity.CognitoUserSession(sessionData);
  return cognitoUserSession;
}

function registerUser(username, password, email) {
  let attributeList = [];
  attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email }));

  userPool.signUp(username, password, attributeList, null, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    cognitoUser = result.user;
    console.log('user name is ' + result.user);
    console.log('user name is ' + cognitoUser.getUsername());
  });
}

function confirmVerificationCode(username, code) {

  let userData = {
    Username: username,
    Pool: userPool
  };
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.confirmRegistration(code, true, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(result);
  });
}

function resendConfirmationCode(username) {

  let userData = {
    Username: username,
    Pool: userPool
  };
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.resendConfirmationCode(function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(result);
  });

}

function login(username, password) {
  let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: username,
    Password: password,
  });

  let userData = {
    Username: username,
    Pool: userPool
  };
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      console.log('Result:', result);
      console.log('access token =====' + result.getAccessToken().getJwtToken());
      console.log('id token ====' + result.getIdToken().getJwtToken());
      console.log('refresh token ===' + result.getRefreshToken().getToken());
    },
    onFailure: function (err) {
      console.log(err);
    },
    mfaRequired: function (challengeName, challengeParameters) {
      console.log('mfaRequired');
      // let verificationCode = prompt('Please input verification code', '');
      // cognitoUser.sendMFACode(verificationCode, this);
    },
    totpRequired: function (challengeName, challengeParameters) {
      console.log('totpRequired');
      console.log('challengeName===',challengeName);

      console.log('challengeParameters==',challengeParameters);
      // let verificationCode = prompt('Please input verification code', '');
      // cognitoUser.sendMFACode(verificationCode, this);
    },
    customChallenge: function (challengeName, challengeParameters) {
      console.log('customChallenge');
      // let verificationCode = prompt('Please input verification code', '');
      // cognitoUser.sendMFACode(verificationCode, this);
    },
    mfaSetup: function (challengeName, challengeParameters) {
      console.log('mfaSetup');
      // let verificationCode = prompt('Please input verification code', '');
      // cognitoUser.sendMFACode(verificationCode, this);
    },
    selectMFAType: function (challengeName, challengeParameters) {
      console.log('selectMFAType');
      // let verificationCode = prompt('Please input verification code', '');
      // cognitoUser.sendMFACode(verificationCode, this);
    }
  });
}



function forgotPassword(username) {

  let userData = {
    Username: username,
    Pool: userPool
  };
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.forgotPassword({
    onSuccess: function (result) {
      console.log('call result: ' + result);
    },
    onFailure: function (err) {
      console.log('call err: ' + err);
    },
    inputVerificationCode() {
      console.log('call inputVerificationCode: ');
      // let verificationCode = prompt('Please input verification code ' ,'');
      // let newPassword = prompt('Enter new password ' ,'');
      // cognitoUser.confirmPassword(verificationCode, newPassword, this);
    }
  });

}

function confirmPassword(username, verificationCode, newPassword) {

  let userData = {
    Username: username,
    Pool: userPool
  };
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.confirmPassword(verificationCode, newPassword, {
    onSuccess: function () {
      console.log('call onSuccess: ');
    },
    onFailure: function (err) {
      console.log('call err: ' + err);
    }
  });

}


function deleteUser(username) {
  let userData = {
    Username: username,
    Pool: userPool
  };
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  let cognitoUserSession = getSession(accessToekn, idToken, refreshToken);
  cognitoUser.setSignInUserSession(cognitoUserSession);

  cognitoUser.deleteUser(function (err, result) {
    if (err) {
      console.log('call error: ' + err);
      return;
    }
    console.log('call result: ' + result);
  });
}



function signOut(username) {

  let userData = {
    Username: username,
    Pool: userPool
  };
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  if (cognitoUser != null) {
    cognitoUser.signOut();
  }
}


function enableMFA(username) {
  let userData = {
    Username: username,
    Pool: userPool
  };
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  let cognitoUserSession = getSession(accessToekn, idToken, refreshToken);
  cognitoUser.setSignInUserSession(cognitoUserSession);

  cognitoUser.enableMFA(function (err, result) {
    if (err) {
      console.log('call error: ' + err.message);
      return;
    }
    console.log('call result: ' + result);
  });
}

function disableMFA(username) {
  let userData = {
    Username: username,
    Pool: userPool
  };
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  let cognitoUserSession = getSession(accessToekn, idToken, refreshToken);
  cognitoUser.setSignInUserSession(cognitoUserSession);

  cognitoUser.disableMFA(function (err, result) {
    if (err) {
      console.log('call error: ' + err);
      return;
    }
    console.log('call result: ' + result);
  });
}

function updateAttributes(username, attributeList) {
  let userData = {
    Username: username,
    Pool: userPool
  };
  let attribute = new AmazonCognitoIdentity.CognitoUserAttribute(attribute);
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  let cognitoUserSession = getSession(accessToekn, idToken, refreshToken);
  cognitoUser.setSignInUserSession(cognitoUserSession);
  cognitoUser.updateAttributes(attributeList, function (err, result) {
    if (err) {
      console.log('call error: ' + err);
      return;
    }
    console.log('call result: ' + result);
  });
}

function deleteAttributes(username, attributeList) {
  let userData = {
    Username: username,
    Pool: userPool
  };
  let attribute = new AmazonCognitoIdentity.CognitoUserAttribute(attribute);
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  let cognitoUserSession = getSession(accessToekn, idToken, refreshToken);
  cognitoUser.setSignInUserSession(cognitoUserSession);
  cognitoUser.deleteAttributes(attributeList, function (err, result) {
    if (err) {
      console.log('call error: ' + err);
      return;
    }
    console.log('call result: ' + result);
  });
}

let attributeList = [];
let attribute = {
  Name: 'nickname',
  Value: 'joe'
};
attributeList.push(attribute);



function softwareToken(username) {
  let userData = {
    Username: username,
    Pool: userPool
  };
  let attribute = new AmazonCognitoIdentity.CognitoUserAttribute(attribute);
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  let cognitoUserSession = getSession(accessToekn, idToken, refreshToken);
  cognitoUser.setSignInUserSession(cognitoUserSession);
  cognitoUser.associateSoftwareToken({
    associateSecretCode: function (code) {
      console.log('call onSuccess: ' + code);
    },
    onFailure: function (err) {
      console.log('call err: ' + err);
    }
  });
}

function verifySoftwareToken(username, verificationCode, friendlyDeviceName) {
  let userData = {
    Username: username,
    Pool: userPool
  };
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  // let cognitoUserSession = getSession(accessToekn, idToken, refreshToken);
  // cognitoUser.setSignInUserSession(cognitoUserSession);


  cognitoUser.verifySoftwareToken(verificationCode, friendlyDeviceName, {
    onSuccess: function (result) {
      console.log('call onSuccess: ' + result);
      console.log('Result:', result);
      console.log('access token =====' + result.getAccessToken().getJwtToken());
      console.log('id token ====' + result.getIdToken().getJwtToken());
      console.log('refresh token ===' + result.getRefreshToken().getToken());
    },
    onFailure: function (err) {
      console.log('call err: ' + err.message);
    }
  });
}

function sendMFACode(username, verificationCode,mfaType) {
  let userData = {
    Username: username,
    Pool: userPool
  };
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  // let cognitoUserSession = getSession(accessToekn, idToken, refreshToken);
  // cognitoUser.setSignInUserSession(cognitoUserSession);


  cognitoUser.sendMFACode(verificationCode, {
    onSuccess: function (result) {
      console.log('call onSuccess: ' + result);
      console.log('Result:', result);
      console.log('access token =====' + result.getAccessToken().getJwtToken());
      console.log('id token ====' + result.getIdToken().getJwtToken());
      console.log('refresh token ===' + result.getRefreshToken().getToken());
    },
    onFailure: function (err) {
      console.log('call err: ' + err.message);
    }
  },mfaType);
}

function getUserAttributes(username) {
  let userData = {
    Username: username,
    Pool: userPool
  };
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  let cognitoUserSession = getSession(accessToekn, idToken, refreshToken);
  cognitoUser.setSignInUserSession(cognitoUserSession);
  cognitoUser.getUserAttributes(function (err, result) {
    if (err) {
      console.log('call err: ' + err.message);
      return;
    }
    for (i = 0; i < result.length; i++) {
      console.log('attribute ' + result[i].getName() + ' ===== ' + result[i].getValue());
    }
  });
}

function setUserMfaPreference(username,peferredMfa,enabled) {
  let userData = {
    Username: username,
    Pool: userPool
  };

  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  let cognitoUserSession = getSession(accessToekn, idToken, refreshToken);
  cognitoUser.setSignInUserSession(cognitoUserSession);
  let smsMfaSettings = null;
  let softwareTokenMfaSettings = {
    PreferredMfa: peferredMfa,
    Enabled: enabled
  }

  cognitoUser.setUserMfaPreference(smsMfaSettings, softwareTokenMfaSettings, function (err, result) {
    if (err) {
      console.log('call err: ' + err.message);
      return;
    }
    console.log('call result: ' + result);
  });
}

function initiateAuth(username, password) {


  // var params = {
  //   AuthFlow: USER_SRP_AUTH, // | REFRESH_TOKEN_AUTH | REFRESH_TOKEN | CUSTOM_AUTH | ADMIN_NO_SRP_AUTH | USER_PASSWORD_AUTH, /* required */
  //   ClientId: userData.ClientId, /* required */
  //   // AnalyticsMetadata: {
  //   //   AnalyticsEndpointId: 'STRING_VALUE'
  //   // },
  //   AuthParameters: {
  //     USERNAME: username,
  //     PASSWORD: password
  // },
  //   // ClientMetadata: {
  //   //   '<StringType>': 'STRING_VALUE',
  //   //   /* '<StringType>': ... */
  //   // },
  //   // UserContextData: {
  //   //   EncodedData: 'STRING_VALUE'
  //   // }
  // };
  // AWS.cognitoidentityserviceprovider
  // cognitoidentityserviceprovider.initiateAuth(params, function(err, data) {
  //   if (err) console.log(err, err.stack); // an error occurred
  //   else     console.log(data);           // successful response
  // });



  let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: username,
    Password: password
    });

  let userData = {
    Username: username,
    Pool: userPool
  };
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.setAuthenticationFlowType('USER_SRP_AUTH');
  let flow = cognitoUser.getAuthenticationFlowType()
  console.log('flow==',flow);

  var authenticationDetails1 = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: poolData.ClientId,
    UserPoolId: poolData.UserPoolId,
    AuthParameters: {
        USERNAME: username,
        PASSWORD: password
    }

};
  cognitoUser.initiateAuth(authenticationDetails, {
    onSuccess: function (result) {
      console.log('Result:', result);
      console.log('access token =====' + result.getAccessToken().getJwtToken());
      console.log('id token ====' + result.getIdToken().getJwtToken());
      console.log('refresh token ===' + result.getRefreshToken().getToken());
    },
    onFailure: function (err) {
      console.log(err);
    },
    mfaRequired: function (challengeName, challengeParameters) {
      console.log('mfaRequired');
      console.log('challengeName==',challengeName)
      console.log('challengeParameters==',challengeParameters)
      // let verificationCode = prompt('Please input verification code', '');
      // cognitoUser.sendMFACode(verificationCode, this);
    },
    totpRequired: function (challengeName, challengeParameters) {
      console.log('totpRequired');
      console.log('challengeName==',challengeName)
      console.log('challengeParameters==',challengeParameters)
      // let verificationCode = prompt('Please input verification code', '');
      // cognitoUser.sendMFACode(verificationCode, this);
    },
    customChallenge: function (challengeName, challengeParameters) {
      console.log('customChallenge');
      console.log('challengeName==',challengeName)
      console.log('challengeParameters==',challengeParameters)
      // let verificationCode = prompt('Please input verification code', '');
      // cognitoUser.sendMFACode(verificationCode, this);
    },
    mfaSetup: function (challengeName, challengeParameters) {
      console.log('mfaSetup');
      console.log('challengeName==',challengeName)
      console.log('challengeParameters==',challengeParameters)
      // let verificationCode = prompt('Please input verification code', '');
      // cognitoUser.sendMFACode(verificationCode, this);
    },
    selectMFAType: function (challengeName, challengeParameters) {
      console.log('selectMFAType');
      console.log('challengeName==',challengeName)
      console.log('challengeParameters==',challengeParameters)
      // let verificationCode = prompt('Please input verification code', '');
      // cognitoUser.sendMFACode(verificationCode, this);
    }
  });
}

function listuset(username,password){

  const poolData = {
    UserPoolId: "us-east-1_5qbMmuCQw",//"us-east-1_EQDyKB9QH",//"us-east-1_ghA68uMnT",//"us-east-1_CCWuMQaJD", //"us-east-1_sSz1cdGIY", // Your user pool id here    
    ClientId: "6i801615gv5kk29hq3b684e9q1",//"36od9lj3cms84c84714hq3f170",//"5qchngsfrb8sh7hmc97gqsjmaa",//"18me92ka1sv0f3c9u3bo7inoja", // Your client id here
    region:  'us-east-1'
  };

  let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: username,
    Password: password
    });
  let params =  {
    "AttributesToGet": [ "email" ],
     "Filter": username,
    // "Limit": number,
    // "PaginationToken": "string",
    "UserPoolId": poolData.UserPoolId
 }


const pool_region = 'us-east-1';
// AWS.AWSCognito.config.region = 'us-east-1';
// AWS.AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: '...' 
// });
  // var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-19', region: 'us-east-1',IdentityPoolId: poolData.UserPoolId});

  var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(authenticationDetails);

  cognitoidentityserviceprovider.listUsers(params, function (err, result) {
    if (err) {
      console.log('call err: ' + err.message);
      return;
    }
    console.log('call result: ' + result);
  });
}
function createAdminUser(username,email){
  let attributeList = [];
  attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email }));
  const poolData = {
    UserPoolId: "us-east-1_5qbMmuCQw",
    Username: username,
    UserAttributes: attributeList
  };
let configPAra = {
  region: 'us-east-1',
  credentials : {
    accessKeyId : '',
    secretAccessKey: ''
  }
}

  var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  let config = new AWS.ConfigBase(configPAra);
  cognitoidentityserviceprovider.config = config;

  cognitoidentityserviceprovider.adminCreateUser(poolData, function (err ,result) {

    if (err) {
      console.log('call err: ' + err.message);
      return;
    }
    console.log('call result: ' + result);
  });
}

// createAdminUser('adminjeevan','jeevan.ghule89@gmail.com');

// listuset('jeevan2','Qwerty123!'); 


// initiateAuth('jeevan1','Qwerty123!'); 
// setUserMfaPreference('jeevan1',true,true); 
// getUserAttributes('jeevan');
//  verifySoftwareToken('jeevan1','444896','J');
//  sendMFACode('jeevan1','016956','SOFTWARE_TOKEN_MFA');
// softwareToke('jeevan1');
// -- Without session object
// registerUser('jeevan2', 'Qwerty123!', 'jeevan.ghule89@gmail.com');
// confirmVerificationCode('jeevan2','689539');
// resendConfirmationCode('jeevan1');
// login('jeevan2','Qwerty123!');
// 5. forgotPassword('jeevan')
// 6. confirmPassword('jeevan','625454','Qwerty12345!')
// 7. signOut('jeevan');

//-- With session object
// 1. deleteUser('jeevan');   
// enableMFA('jeevan');  
// 3. disableMFA('jeevan'); 
// 4. changePassword('jeevan','Qwerty123!','Qwerty12345!'); 
// 5. updateAttributes('jeevan', attributeList); 
// 6. deleteAttributes('jeevan', ['nickname']); 



// -- Without session object
// 1. RegisterUser('jeevan','Qwerty123!','jeevan.ghule89@gmail.com');
// 2. confirmVerificationCode('jeevan','923541');
// 3. resendConfirmationCode('jeevan');
// 4. login('jeevan','Qwerty123!');
// 5. forgotPassword('jeevan')
// 6. confirmPassword('jeevan','625454','Qwerty12345!')
// 7. signOut('jeevan');

//-- With session object
// 1. deleteUser('jeevan');   
// 2. enableMFA('jeevan');  
// 3. disableMFA('jeevan'); 
// 4. changePassword('jeevan','Qwerty123!','Qwerty12345!'); 
// 5. updateAttributes('jeevan', attributeList); 
// 6. deleteAttributes('jeevan', ['nickname']); 
// 7. setUserMfaPreference('jeevan',true,true); 
// 8. getUserAttributes('jeevan');
// 9. verifySoftwareToken('jeevan','962293','J');
// 10. softwareToken('jeevan1');




