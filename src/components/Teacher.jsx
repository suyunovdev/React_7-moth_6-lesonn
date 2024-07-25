import { useEffect, useState } from "react";
import axios from "axios";
import "./Teacher.css";
import "../App.css";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Input, Layout, Menu, Modal, Select, Table } from "antd";
import { Link } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const Teacher = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [searchText, setSearchText] = useState(""); // State for search query
  const [selectedLevel, setSelectedLevel] = useState(""); // State for selected level filter

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = () => {
    axios
      .get("http://localhost:3000/teacher")
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error("Error fetching teachers: ", error);
      });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedTeacher(null);
  };

  const handleSave = () => {
    if (selectedTeacher && selectedTeacher.id) {
      // Existing teacher, perform update
      axios
        .put(
          `http://localhost:3000/teacher/${selectedTeacher.id}`,
          selectedTeacher
        )
        .then(() => {
          fetchTeachers();
          setIsModalOpen(false);
          setSelectedTeacher(null);
        })
        .catch(error => {
          console.error("Error updating teacher: ", error);
          alert("Failed to update teacher. Please try again later.");
        });
    } else {
      // New teacher, perform add
      axios
        .post("http://localhost:3000/teacher", selectedTeacher)
        .then(() => {
          fetchTeachers();
          setIsModalOpen(false);
          setSelectedTeacher(null);
        })
        .catch(error => {
          console.error("Error adding new teacher: ", error);
          alert("Failed to add new teacher. Please try again later.");
        });
    }
  };

  const handleDelete = record => {
    axios
      .delete(`http://localhost:3000/teacher/${record.id}`)
      .then(() => {
        fetchTeachers();
      })
      .catch(error => {
        console.error("Error deleting teacher: ", error);
        alert("Failed to delete teacher. Please try again later.");
      });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button type="primary" onClick={() => editTeacher(record)}>
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  const editTeacher = record => {
    setSelectedTeacher(record);
    setIsModalOpen(true);
  };

  // Filtered data source based on searchText and selectedLevel
  const filteredDataSource = data.filter(teacher => {
    const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchText.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
      teacher.firstName.toLowerCase().includes(searchText.toLowerCase());
    const matchesLevel = selectedLevel ? teacher.level === selectedLevel : true;
    return matchesSearch && matchesLevel;
  });

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            Teachers
          </Menu.Item>
          <Link to="/students">
            <Menu.Item key="2" icon={<UserOutlined />}>
              Students
            </Menu.Item>
          </Link>
        </Menu>
      </Sider>

      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Link to="/profil">
            <Button type="text">
              <UserOutlined />
            </Button>
          </Link>
        </Header>

        <Content style={{ margin: "16px" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}>
            <div style={{ marginBottom: "16px" }}>
              <Input.Search
                placeholder="Search..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{
                  width: "200px",
                  marginRight: "16px",
                  marginBottom: "16px",
                }}
              />
              <Select
                style={{ width: "120px", marginRight: "16px" }}
                value={selectedLevel}
                onChange={value => setSelectedLevel(value)}
                placeholder="Select Level">
                <Select.Option value="Senior">Senior</Select.Option>
                <Select.Option value="Middle">Middle</Select.Option>
                <Select.Option value="Junior">Junior</Select.Option>
              </Select>
              <Button type="primary" onClick={showModal}>
                Add Teacher
              </Button>
            </div>

            <Table
              dataSource={filteredDataSource}
              columns={columns}
              rowKey="id"
            />
          </div>
        </Content>
      </Layout>

      <Modal
        title={selectedTeacher ? "Edit Teacher" : "Add Teacher"}
        visible={isModalOpen}
        onOk={handleSave}
        onCancel={handleCancel}>
        <Input
          placeholder="First Name"
          value={selectedTeacher ? selectedTeacher.firstName : ""}
          onChange={e =>
            setSelectedTeacher({
              ...selectedTeacher,
              firstName: e.target.value,
            })
          }
          style={{ marginBottom: "12px" }}
        />
        <Input
          placeholder="Last Name"
          value={selectedTeacher ? selectedTeacher.lastName : ""}
          onChange={e =>
            setSelectedTeacher({ ...selectedTeacher, lastName: e.target.value })
          }
          style={{ marginBottom: "12px" }}
        />
        <Select
          placeholder="Select Level"
          value={selectedTeacher ? selectedTeacher.level : undefined}
          onChange={value =>
            setSelectedTeacher({ ...selectedTeacher, level: value })
          }
          style={{ width: "100%", marginBottom: "12px" }}>
          <Select.Option value="Senior">Senior</Select.Option>
          <Select.Option value="Middle">Middle</Select.Option>
          <Select.Option value="Junior">Junior</Select.Option>
        </Select>
      </Modal>
    </Layout>
  );
};

export default Teacher;
