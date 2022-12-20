import "./Header.scss";
import { Layout, Row, Col, Button } from "antd";
import header from "@assets/images/header.png";
import useToken from "@/helpers/useToken";
import { useNavigate } from "react-router";

const { Header } = Layout;

function HeaderPage(props: any) {
  const { token, setToken } = useToken();

  const navigate = useNavigate();

  return (
    <Layout>
      <Header>
        <Row>
          <Col span={8}>
            <img src={header}></img>
            <span className="title-hearder"> BE</span>
          </Col>
          <Col span={8}> </Col>
          <Col span={8}>
            {token ? (
              <span className="user-name-hearder">
                <Button
                  onClick={() => {
                    setToken(null);
                    navigate("/");
                  }}
                >
                  Logout
                </Button>
              </span>
            ) : (
              <span className="user-name-hearder">
                <Button onClick={() => navigate("/login")}>Login</Button>
              </span>
            )}

            {/* <span className="user-name-hearder">admin@beyonedge.co</span> */}
          </Col>
        </Row>
      </Header>
    </Layout>
  );
}

export default HeaderPage;
