import { useEffect, useState } from "react";
import "../App.css";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Input, Layout, Menu, Modal, Select, Table } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Teacher.css";

const { Header, Sider, Content } = Layout;

const Students = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios
      .get("http://localhost:3000/name")
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error("Error fetching students: ", error);
      });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleSave = () => {
    if (
      !selectedStudent.firstName ||
      !selectedStudent.lastName ||
      !selectedStudent.group
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    if (selectedStudent.id) {
      axios
        .put(
          `http://localhost:3000/name/${selectedStudent.id}`,
          selectedStudent
        )
        .then(() => {
          fetchStudents();
          setIsModalOpen(false);
          setSelectedStudent(null);
        })
        .catch(error => {
          console.error("Error updating student: ", error);
          alert("Failed to update student. Please try again later.");
        });
    } else {
      axios
        .post("http://localhost:3000/name", selectedStudent)
        .then(() => {
          fetchStudents();
          setIsModalOpen(false);
          setSelectedStudent(null);
        })
        .catch(error => {
          console.error("Error adding new student: ", error);
          alert("Failed to add new student. Please try again later.");
        });
    }
  };

  const handleDelete = record => {
    axios
      .delete(`http://localhost:3000/name/${record.id}`)
      .then(() => {
        fetchStudents();
      })
      .catch(error => {
        console.error("Error deleting student: ", error);
        alert("Failed to delete student. Please try again later.");
      });
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Group",
      dataIndex: "group",
      key: "group",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button type="primary" onClick={() => editStudent(record)}>
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  const editStudent = record => {
    setSelectedStudent(record);
    setIsModalOpen(true);
  };

  const filteredDataSource = data.filter(student => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const searchWords = searchText.toLowerCase().trim().split(/\s+/);
    const groupFilter = selectedGroup ? student.group === selectedGroup : true;
    return (
      searchWords.every(word => fullName.includes(word)) &&
      (student.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
        student.firstName.toLowerCase().includes(searchText.toLowerCase())) &&
      groupFilter
    );
  });

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["2"]}>
          <Link to="/teacher">
            <Menu.Item key="1" icon={<UserOutlined />}>
              Teachers
            </Menu.Item>
          </Link>
          <Menu.Item key="2" icon={<UserOutlined />}>
            Students
          </Menu.Item>
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
                  width: "300px",
                  marginRight: "16px",
                  marginBottom: "16px",
                }}
              />
              <Select
                style={{ width: "120px", marginRight: "16px" }}
                value={selectedGroup}
                onChange={value => setSelectedGroup(value)}
                placeholder="Select Group">
                <Select.Option value="N58">N58</Select.Option>
                <Select.Option value="N40">N40</Select.Option>
                <Select.Option value="N30">N30</Select.Option>
              </Select>
              <Button type="primary" onClick={showModal}>
                Add Student
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
        title={selectedStudent ? "Edit Student" : "Add Student"}
        visible={isModalOpen}
        onOk={handleSave}
        onCancel={handleCancel}>
        <Input
          placeholder="First Name"
          value={selectedStudent ? selectedStudent.firstName : ""}
          onChange={e =>
            setSelectedStudent({
              ...selectedStudent,
              firstName: e.target.value,
            })
          }
          style={{ marginBottom: "12px" }}
        />
        <Input
          placeholder="Last Name"
          value={selectedStudent ? selectedStudent.lastName : ""}
          onChange={e =>
            setSelectedStudent({ ...selectedStudent, lastName: e.target.value })
          }
          style={{ marginBottom: "12px" }}
        />
        <Select
          placeholder="Select Group"
          value={selectedStudent ? selectedStudent.group : undefined}
          onChange={value =>
            setSelectedStudent({ ...selectedStudent, group: value })
          }
          style={{ width: "100%", marginBottom: "12px" }}>
          <Select.Option value="N58">N58</Select.Option>
          <Select.Option value="N40">N40</Select.Option>
          <Select.Option value="N30">N30</Select.Option>
        </Select>
      </Modal>
    </Layout>
  );
};

export default Students;
