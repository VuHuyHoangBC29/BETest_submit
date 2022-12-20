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
import httpClientApi from "@/apis/http-client.api";

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

  const [selectedUser, setSelectedUser] = useState<UserType | null>();

  const dispatch = useDispatch<AppDispatch>();

  const [form] = Form.useForm();

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

    const user = {
      name: values.name,
      age: parseInt(values.age),
    };

    if (selectedUser) {
      await httpClientApi.httpPut("/usersList", user);
    } else {
      dispatch(addUserAction(user));
    }

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
  const onSearch = (value: string) => {
    console.log(value);

    let searchData = usersList.filter((ele) => {
      return (
        ele.name.toLowerCase().trim().indexOf(value.toLowerCase().trim()) !==
          -1 ||
        ele.id.toLowerCase().trim().indexOf(value.toLowerCase().trim()) !==
          -1 ||
        ele.age.toString().trim().indexOf(value.toLowerCase().trim()) !== -1
      );
    });

    console.log(searchData);

    setSearchState(searchData);
  };
  //End of Search function

  //Form
  const showPopover = (record: any) => {
    // setIsShowPopover(true);
    setkeySelectRecord(record.id);

    console.log(record);

    setSelectedUser(record);

    showModal();
  };

  useEffect(() => {
    if (selectedUser) {
      form.setFieldsValue({
        ...selectedUser,
      });
    } else {
      form.setFieldsValue({});
    }
  }, [selectedUser]);

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
                    <a onClick={() => onEditUser(record)}>{record.id}</a>
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
                  onClick={() => {
                    setIsModalOpen(true);
                    setSelectedUser(null);
                    form.setFieldsValue({
                      name: "",
                      age: "",
                    });
                  }}
                >
                  Add User
                </Button>
              </Col>
            </Row>
            <hr></hr>
            <Table
              columns={columns}
              dataSource={searchState.length > 0 ? searchState : usersList}
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
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{
            name: "",
            age: "",
          }}
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
            {selectedUser ? (
              <Button type="primary" htmlType="submit">
                Edit user
              </Button>
            ) : (
              <Button type="primary" htmlType="submit">
                Add user
              </Button>
            )}

            {/* <Button type="primary" htmlType="submit">
              Add user
            </Button> */}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default User;
