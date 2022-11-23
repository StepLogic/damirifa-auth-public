import statusCodes from "@lib/statusCodes";
import { generateOTP } from "@lib/utils";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { generateTemplate } from "src/email/registerTemplate";
import { v4 as uuid } from "uuid";
import { responseBody } from "src/interfaces";
import { otpExpiry } from "src/lib/constants";
const domain = process.env.DOMAIN;
const key = process.env.MAIL_GUN_API;
var mailgun = require("mailgun-js")({
  apiKey: key,
  domain: domain,
});

const prisma = new PrismaClient();

const sendEmailVerification: Function = async (data: any) => {
  let payload: responseBody;
  const { email } = data;
  try {
    if (email) {
      const hash = uuid();
      const html = await generateTemplate(hash, email);
      let _data = {
        from: "Damirifa<support@damirifa.com>",
        to: email,
        subject: "Verification oF Email",
        html,
        text: "Test Email Verification",
      };

      // let error;
      // let body;
      // const vlaue = await mailgun
      //   .messages()
      //   .send(_data, async (_error: any, _body: any) => {
      //     error = _error;
      //     body = _body;
      //     return body;
      //   });
      // const response = await axios.post(
      //   `https://api.mailgun.net/v3/sandbox2838fb48bbaf47ef85d586cb2a832700.mailgun.org/messages`,
      //   { ..._data },
      //   {
      //     auth: {
      //       username: "api",
      //       password: "ffef3f6d50685a008c45bab80c229136-523596d9-b76d31c0",
      //     },
      //   }
      // );
      const response = await axios({
        method: "post",
        url: `{YOUR MAILGUN URL }`,
        auth: {
          username: "api",
          password: `{PASSWORD FOR MAILGUN}`,
        },
        params: {
          ..._data,
        },
      });
      // .then((e) => {
      //   console.log(e.data);
      // })
      // .catch((e) => {
      //   console.log(e);
      // });

      if (response.data.message === "Queued. Thank you.") {
        const _repsonse = await prisma.emailVerificationTable.create({
          data: {
            uuid: hash,
            email: email,
          },
        });
        if (_repsonse) {
          payload = {
            statusCode: statusCodes.POST_SUCCESS,
            payload: response.data,
          };
          return payload;
        }
      } else {
        payload = {
          statusCode: statusCodes.INTERNAL_SERVER_ERROR,
          msg: "email cannot be empty",
        };
        return payload;
      }
    } else {
      payload = {
        statusCode: statusCodes.BAD_REQUEST,
        msg: "email cannot be empty",
      };
      return payload;
    }
  } catch (e: any) {
    payload = {
      statusCode: statusCodes.INTERNAL_SERVER_ERROR,
      msg: e,
    };
    return payload;
  }
};
const confirmEmailVerification: Function = async (data: any) => {
  let payload: responseBody;
  const { email, uuid } = data;
  try {
    if (!email || !uuid) {
      payload = {
        statusCode: statusCodes.BAD_REQUEST,
        msg: "phone or uuid",
      };
      return payload;
    } else {
      const _response = await prisma.emailVerificationTable.findMany({
        where: {
          email: { equals: email },
          uuid: { equals: uuid },
        },
      });
      if (_response.length === 1) {
        payload = {
          statusCode: statusCodes.POST_SUCCESS,
          msg: `Email Confirmed ${email}`,
        };
      } else {
        payload = {
          statusCode: statusCodes.UNAUTHORIZED,
        };
      }
      return payload;
    }
  } catch (e: any) {
    payload = {
      statusCode: statusCodes.INTERNAL_SERVER_ERROR,
      msg: e,
    };
  }
};
const sendMobileVerification: Function = async (data: any) => {
  let payload: responseBody;
  const { phone } = data;
  try {
    if (!phone) {
      payload = {
        statusCode: statusCodes.BAD_REQUEST,
        msg: "phone field empty",
      };
      return payload;
    } else {
      const identifier = data.phone.trim();
      const otp = generateOTP();
      const response = await prisma.oTPTable.create({
        data: {
          otp: String(otp),
          phone: identifier,
        },
      });

      if (response.id) {
        const otpTemplate = `https://api.logonvoice.com/sms/api.php?api={LOGON VOICE API KEY}2&phone=${identifier}&from=${"Damirifa"}&msg=Your Damirifa verification code is ${otp}`;
        const smsResponse = await axios.get(otpTemplate);
        if (smsResponse.data.status !== "Failed") {
          payload = {
            statusCode: statusCodes.POST_SUCCESS,
            msg: smsResponse.data.status.message,
          };
          return payload;
        }
      }
    }
  } catch (e: any) {
    payload = {
      statusCode: statusCodes.INTERNAL_SERVER_ERROR,
      msg: e,
    };
  }
};
const confirmMobileVerification: Function = async (data: any) => {
  let payload: responseBody;
  const { phone, otp } = data;
  try {
    if (!otp || !phone) {
      payload = {
        statusCode: statusCodes.BAD_REQUEST,
        msg: "phone or otp cannot be empty",
      };
      return payload;
    } else {
      const _response = await prisma.oTPTable.findMany({
        where: {
          otp: { equals: otp },
          phone: { equals: phone },
        },
      });
      if ((_response.length = 1)) {
        const { sent } = _response[0];
        var _sent = new Date(sent);
        var _now = new Date();
        let dif = (_now.getTime() - _sent.getTime()) / 1000;
        if (dif < otpExpiry) {
          payload = {
            statusCode: statusCodes.POST_SUCCESS,
            msg: "Valid OTP",
          };
          return payload;
        } else {
          payload = {
            statusCode: statusCodes.UNAUTHORIZED,
            msg: "OTP Expired",
          };
          return payload;
        }
      }
    }
  } catch (e: any) {
    payload = {
      statusCode: statusCodes.INTERNAL_SERVER_ERROR,
      msg: e,
    };
  }
};
const loginUser: Function = async (data: any) => {
  let payload: responseBody;
  const { email, phone, password } = data;
  if ((!email && !phone) || !password) {
    payload = {
      statusCode: statusCodes.BAD_REQUEST,
      msg: "Password or Email/Phone field Empty",
    };
    return payload;
  } else {
    const _repsonse = await prisma.user.findMany({
      where: {
        password: { equals: password },
        OR: [{ phone: { equals: phone } }, { email: { equals: email } }],
      },
    });
    // console.log(_repsonse);
    if (_repsonse.length >= 1) {
      payload = {
        statusCode: statusCodes.POST_SUCCESS,
        payload: _repsonse[0],
      };
    } else {
      payload = {
        statusCode: statusCodes.UNAUTHORIZED,
        msg: "no user found",
      };
    }
    return payload;
  }
};
const registerUser: Function = async (data: any) => {
  const { email, phone } = data;
  let payload: responseBody;

  try {
    if (!email && !phone) {
      payload = {
        statusCode: statusCodes.BAD_REQUEST,
        msg: "phone or email cannot be empty",
      };
      return payload;
    } else {
      const _response = await prisma.user.create({
        data: {
          ...data,
        },
      });
      console.log(_response);
      if (_response) {
        payload = {
          statusCode: statusCodes.POST_SUCCESS,
          payload: _response,
        };
      } else {
        payload = {
          statusCode: statusCodes.INTERNAL_SERVER_ERROR,
          msg: "could not create user",
        };
      }
      return payload;
    }
  } catch (e: any) {
    payload = {
      statusCode: statusCodes.INTERNAL_SERVER_ERROR,
      msg: e,
    };
  }
};
const updateUser: Function = () => {};
const deleteUser: Function = () => {};
export {
  sendEmailVerification,
  sendMobileVerification,
  confirmEmailVerification,
  confirmMobileVerification,
  loginUser,
  registerUser,
  updateUser,
  deleteUser,
};
