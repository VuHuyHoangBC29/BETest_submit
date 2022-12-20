import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import {
  Breadcrumb,
  Layout,
  Row,
  Col,
  Input,
  Table,
  Popover,
  Button,
  Tag,
  Form,
} from "antd";

import { Modal } from "antd";

import "./User.scss";
import Loading from "@components/Loading/Loading";
import HeaderPage from "@/pages/Header/Header";
import MenuPage from "@/pages/Menu/Menu";
import { PATH } from "@constants/paths";
import edit from "@assets/images/icons/ico-edit.svg";
import client from "@assets/images/users/icon-user.png";
import useToken from "@/helpers/useToken";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  addUserAction,
  fetchUsersListAction,
  UserType,
} from "@/store/reducers/usersListReducer";
import { ColumnsType } from "antd/lib/table";
import DeleteIcon from "@mui/icons-material/Delete";

const { Search } = Input;
const { Content } = Layout;
function User(props: any) {
  const navigate = useNavigate();
  const [isShowPopover, setIsShowPopover] = useState<boolean>(false);
  const [keySelectRecord, setkeySelectRecord] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [key, setKey] = useState("");
  const { token, setToken } = useToken();
  const [searchState, setSearchState] = useState<UserType[]>([]);

  const [listDataUser, setListDataUser] = useState();

  const dispatch = useDispatch<AppDispatch>();

  // const fetchUserList = async () => {
  //   const response = await httpClientApi.httpGet("/userList");

  //   console.log(response);

  //   setListDataUser(response);

  //   setLocalItem("userList", response);
  // };

  useEffect(() => {
    const keys = window.location.pathname;
    setKey(keys.slice(6));
  }, []);

  useEffect(() => {
    if (token === null) {
      navigate("/login");
    } else {
      dispatch(fetchUsersListAction());
    }
  }, [token]);

  const { usersList } = useSelector(
    (state: RootState) => state.usersListReducer,
  );

  const showPopover = (record: any) => {
    setIsShowPopover(true);
    setkeySelectRecord(record.id);
  };

  const onEditUser = (record: any) => {
    navigate(`/home/user/edit/${record.id}`);
  };

  const onDeleteUser = (record: any) => {
    console.log("onDeleteUser", record);
  };

  const handleClickChange = (visible: any) => {
    setIsShowPopover(visible);
  };

  //Modal function
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  //End of Modal function

  //Add user function
  const onFinish = async (values: any) => {
    console.log("Success:", values);

    const newUser = {
      name: values.name,
      age: parseInt(values.age),
    };

    dispatch(addUserAction(newUser));

    setIsModalOpen(false);

    window.location.reload();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  //End of Add user function

  interface DataType {
    key: React.Key;
    id: string;
    name: string;
    age: number;
  }

  //Search function
  const data = usersList.map((ele, idx) => {
    return {
      key: idx + 1,
      // key: ele.id,
      id: ele.id,
      name: ele.name,
      age: ele.age,
    };
  });

  const onSearch = (value: string) => {
    console.log(value);

    let searchData = data.filter((ele) => {
      return (
        ele.name.toLowerCase().trim().indexOf(value.toLowerCase().trim()) !== -1
      );
    });

    console.log(searchData);

    // setSearchState(searchData);

    // console.log(searchState);
  };
  //End of Search function

  const columns = [
    {
      title: "Id",
      width: "5%",
      dataIndex: "id",
      sorter: (a: any, b: any) => (a > b ? -1 : 1),
      key: "id",
    },
    {
      title: "Full Name",
      width: "25%",
      dataIndex: "name",
      key: "name",
      showSorterTooltip: false,
    },
    {
      title: "Age",
      width: "10%",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "",
      width: "5%",
      key: "edit",
      render: (record: any) => (
        <>
          <img src={edit} onClick={() => showPopover(record)}></img>
          {
            <Popover
              content={
                <>
                  <div className="edit-user">
                    <a onClick={() => onEditUser(record)}>Edit</a>
                  </div>
                </>
              }
              trigger="click"
              visible={isShowPopover && keySelectRecord === record.id}
              onVisibleChange={handleClickChange}
            ></Popover>
          }
        </>
      ),
    },
    // {
    //   title: "",
    //   width: "5%",
    //   key: "edit",
    //   render: (record: any) => (
    //     <>
    //       <div>
    //         <Button>Delete</Button>
    //       </div>
    //     </>
    //   ),
    // },
  ];

  return (
    <div id="pageUser">
      {isLoading ? <Loading isLoading={isLoading} /> : undefined}
      <Layout>
        <HeaderPage></HeaderPage>
      </Layout>
      <Layout>
        <MenuPage keySelect={key} />
        <Layout>
          <Breadcrumb>
            <Breadcrumb.Item href="home">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/User">User</Breadcrumb.Item>
          </Breadcrumb>
          <Content className="content-user-list">
            <Row>
              <Col span={24}>
                <div className="title-users">Users</div>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Search
                  placeholder="Search"
                  onSearch={onSearch}
                  className="input-search-user"
                  allowClear
                />
              </Col>
              <Col span={12}></Col>
              <Col span={6}>
                <Button
                  className="bnt-add-user"
                  type="primary"
                  htmlType="submit"
                  // onClick={onAddNewUser}
                  onClick={showModal}
                >
                  Add User
                </Button>
              </Col>
            </Row>
            <hr></hr>
            <Table
              columns={columns}
              dataSource={usersList}
              pagination={false}
            />
          </Content>
        </Layout>
      </Layout>

      <Modal
        title="Add new user"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        {/* <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p> */}
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Full name"
            name="name"
            rules={[{ required: true, message: "Please enter full name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Age"
            name="age"
            rules={[{ required: true, message: "Please enter age!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Add user
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default User;
