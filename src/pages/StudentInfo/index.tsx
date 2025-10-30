import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Input, Select, Space, Typography, Card, Modal, Form, message 
} from 'antd';
import { PlusOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useAppContext } from '../../context/AppContext';
import MainLayout from '../../components/Layout/MainLayout';
import './index.less';

const { Title } = Typography;
const { Option } = Select;
// const { Search } = Input;

interface Student {
  id: string;
  studentId: string;
  name: string;
  gender: string;
  age: number;
  grade: number;
  class: number;
}

interface StudentFilter {
  studentId: string;
  name: string;
  grade: string;
  class: string;
  gender: string;
}

const StudentInfo: React.FC = () => {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const { students, setStudents, addStudent, updateStudent, setLoading } = useAppContext();
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  // 模拟数据
  useEffect(() => {
    if (students.length === 0) {
      const mockData: Student[] = [
        { id: '1', studentId: '2023001', name: '张三', gender: '男', age: 16, grade: 1, class: 1 },
        { id: '2', studentId: '2023002', name: '李四', gender: '女', age: 15, grade: 1, class: 1 },
        { id: '3', studentId: '2023003', name: '王五', gender: '男', age: 16, grade: 1, class: 2 },
        { id: '4', studentId: '2023004', name: '赵六', gender: '女', age: 15, grade: 1, class: 2 },
        { id: '5', studentId: '2023005', name: '钱七', gender: '男', age: 17, grade: 2, class: 1 },
      ];
      setStudents(mockData);
      setFilteredStudents(mockData);
    } else {
      setFilteredStudents(students);
    }
  }, [students, setStudents]);

  // 筛选学生信息
  const handleFilter = async () => {
    try {
      const values = await filterForm.validateFields();
      const filter: StudentFilter = {
        studentId: values.studentId || '',
        name: values.name || '',
        grade: values.grade || '',
        class: values.class || '',
        gender: values.gender || '',
      };

      const result = students.filter(student => {
        return (
          student.studentId.includes(filter.studentId) &&
          student.name.includes(filter.name) &&
          (filter.grade === '' || student.grade.toString() === filter.grade) &&
          (filter.class === '' || student.class.toString() === filter.class) &&
          (filter.gender === '' || student.gender === filter.gender)
        );
      });

      setFilteredStudents(result);
    } catch (error) {
      message.error('筛选条件验证失败');
    }
  };

  // 重置筛选条件
  const handleResetFilter = () => {
    filterForm.resetFields();
    setFilteredStudents(students);
  };

  // 打开新增学生弹窗
  const handleAddStudent = () => {
    setEditingStudent(null);
    form.resetFields();
    setVisible(true);
  };

  // 打开编辑学生弹窗
  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    form.setFieldsValue({
      studentId: student.studentId,
      name: student.name,
      gender: student.gender,
      age: student.age,
      grade: student.grade,
      class: student.class,
    });
    setVisible(true);
  };

  // 提交学生信息
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      if (editingStudent) {
        // 更新学生信息
        const updatedStudent: Student = {
          ...editingStudent,
          ...values,
        };
        updateStudent(updatedStudent);
        message.success('学生信息更新成功');
      } else {
        // 新增学生
        const newStudent: Student = {
          id: Date.now().toString(),
          ...values,
        };
        addStudent(newStudent);
        message.success('学生信息添加成功');
      }
      
      setVisible(false);
    } catch (error) {
      message.error('表单验证失败，请检查输入');
    } finally {
      setLoading(false);
    }
  };

  // 表格列配置
  const columns = [
    {
      title: '学号',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 120,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
      filters: [
        { text: '男', value: '男' },
        { text: '女', value: '女' },
      ],
      onFilter: (value: string, record: Student) => record.gender === value,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 80,
    },
    {
      title: '年级班级',
      dataIndex: ['grade', 'class'],
      key: 'gradeClass',
      render: (_: any, record: { grade: any; class: any; }) => `${record.grade}年级${record.class}班`,
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Student) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditStudent(record)}
          >
            修改
          </Button>
        </Space>
      ),
      width: 100,
    },
  ];

  return (
    <MainLayout onLogout={() => {}}>
      <div className="student-info-container">
        <div className="student-info-header">
          <Title level={2}>学生基本信息管理</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddStudent}
          >
            新增学生
          </Button>
        </div>
        
        <Card className="filter-card">
          <Form form={filterForm} layout="inline" onFinish={handleFilter}>
            <Form.Item name="studentId" label="学号" rules={[{ max: 20, message: '学号最多20个字符' }]}>
              <Input placeholder="请输入学号" style={{ width: 150 }} />
            </Form.Item>
            <Form.Item name="name" label="姓名" rules={[{ max: 20, message: '姓名最多20个字符' }]}>
              <Input placeholder="请输入姓名" style={{ width: 150 }} />
            </Form.Item>
            <Form.Item name="grade" label="年级">
              <Select placeholder="请选择年级" style={{ width: 120 }}>
                <Option value="1">1年级</Option>
                <Option value="2">2年级</Option>
                <Option value="3">3年级</Option>
                <Option value="4">4年级</Option>
                <Option value="5">5年级</Option>
                <Option value="6">6年级</Option>
              </Select>
            </Form.Item>
            <Form.Item name="class" label="班级">
              <Select placeholder="请选择班级" style={{ width: 120 }}>
                <Option value="1">1班</Option>
                <Option value="2">2班</Option>
                <Option value="3">3班</Option>
                <Option value="4">4班</Option>
                <Option value="5">5班</Option>
              </Select>
            </Form.Item>
            <Form.Item name="gender" label="性别">
              <Select placeholder="请选择性别" style={{ width: 120 }}>
                <Option value="男">男</Option>
                <Option value="女">女</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  搜索
                </Button>
                <Button onClick={handleResetFilter}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
        
        <Card className="table-card">
          <Table
            columns={columns as any}
            dataSource={filteredStudents}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
        </Card>
      </div>
      
      {/* 新增/编辑学生弹窗 */}
      <Modal
        title={editingStudent ? '编辑学生信息' : '新增学生'}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            确定
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="student_form">
          <Form.Item
            name="studentId"
            label="学号"
            rules={[
              { required: true, message: '请输入学号' },
              { max: 20, message: '学号最多20个字符' },
            ]}
          >
            <Input placeholder="请输入学号" disabled={!!editingStudent} />
          </Form.Item>
          <Form.Item
            name="name"
            label="姓名"
            rules={[
              { required: true, message: '请输入姓名' },
              { max: 20, message: '姓名最多20个字符' },
            ]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="性别"
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Select placeholder="请选择性别">
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="age"
            label="年龄"
            rules={[
              { required: true, message: '请输入年龄' },
              { type: 'number', min: 5, max: 100, message: '年龄必须在5-100之间' },
            ]}
          >
            <Input type="number" placeholder="请输入年龄" />
          </Form.Item>
          <Form.Item
            name="grade"
            label="年级"
            rules={[{ required: true, message: '请选择年级' }]}
          >
            <Select placeholder="请选择年级">
              <Option value="1">1年级</Option>
              <Option value="2">2年级</Option>
              <Option value="3">3年级</Option>
              <Option value="4">4年级</Option>
              <Option value="5">5年级</Option>
              <Option value="6">6年级</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="class"
            label="班级"
            rules={[{ required: true, message: '请选择班级' }]}
          >
            <Select placeholder="请选择班级">
              <Option value="1">1班</Option>
              <Option value="2">2班</Option>
              <Option value="3">3班</Option>
              <Option value="4">4班</Option>
              <Option value="5">5班</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  );
};

export default StudentInfo;

