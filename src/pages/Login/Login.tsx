import { Layout as AntLayout, Button, Input, Form, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { PATH } from "@constants/paths";
import React, { useEffect, useState } from "react";
import "./Login.scss";
import Loading from "@components/Loading/Loading";
import * as LoginModel from "@/model/login";
import useToken from "@/helpers/useToken";

import logoBE from "@assets/images/logo.png";
import httpClientApi from "@/apis/http-client.api";

interface Props {}
const LoginPage: React.FC<Props> = () => {
  const { token, setToken } = useToken();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [loginInfo, setLoginInfo] = useState<ReqLogin>(
    LoginModel.createEmptyLogin(),
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (token !== null) {
      navigate("/User");
    }
  }, [token]);

  const onTexFieldChange = (fieldId: keyof ReqLogin) => (e: any) => {
    setLoginInfo({
      ...loginInfo,
      [fieldId]: e.target.value,
    });
  };

  const handlePwdChange = (e: any) => {
    setLoginInfo({
      ...loginInfo,
      password: e.target.value,
    });
  };

  const funclogin = async () => {
    setIsLoading(true);
    // Call api login
    // set token

    const response = await httpClientApi.httpGet("/login");

    console.log(response);

    if (response.status === false) {
      setError(true);
      return;
    }

    setToken(response.data.access_token);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <AntLayout>
      {isLoading ? <Loading isLoading={isLoading} /> : undefined}
      <Form
        name="wrap"
        labelCol={{ flex: "110px" }}
        labelAlign="left"
        labelWrap
        wrapperCol={{ flex: 1 }}
        onFinish={funclogin}
        onFinishFailed={onFinishFailed}
        colon={false}
      >
        <Row>
          <Col span={8}></Col>
          <Col span={8}>
            <div className="layoutLoginAdmin">
              <div className="imagelogo">
                <img src={logoBE}></img>
              </div>
              <div className="labelAdmin">
                {" "}
                <span>Wellcome to Besolution</span>
              </div>
              <div className="login-form">
                <div className="formItemInput">
                  <Form.Item
                    name="username"
                    rules={[
                      {
                        type: "email",
                        message: "Please enter a valid email address",
                      },
                      {
                        required: true,
                        message: "Please enter your email",
                      },
                    ]}
                  >
                    <Input
                      name="username"
                      placeholder="Email"
                      onChange={onTexFieldChange("username")}
                      value={loginInfo.username}
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your password",
                      },
                    ]}
                  >
                    <Input
                      type="password"
                      placeholder="Password"
                      name="password"
                      // onChange={handlePwdChange}
                      onChange={onTexFieldChange("password")}
                      value={loginInfo.password}
                    />
                  </Form.Item>
                  <div>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="buttonLogin"
                    >
                      Login
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col span={8}></Col>
        </Row>
      </Form>
    </AntLayout>
  );
};
export default LoginPage;
