import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Input, Select, Space, Typography, Card, Modal, Form, message 
} from 'antd';
import { PlusOutlined, EditOutlined, SearchOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { useAppContext } from '../../context/AppContext';
import MainLayout from '../../components/Layout/MainLayout';
import './index.less';

const { Title } = Typography;
const { Option } = Select;
// const { Search } = Input;

interface Score {
  id: string;
  studentId: string;
  name: string;
  gradeClass: string;
  math: number;
  chinese: number;
  english: number;
  total: number;
}

interface ScoreFilter {
  studentId: string;
  name: string;
  gradeClass: string;
}

interface SortConfig {
  key: keyof Score;
  direction: 'ascending' | 'descending' | null;
}

const ScoreManage: React.FC = () => {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingScore, setEditingScore] = useState<Score | null>(null);
  const { scores, setScores, addScore, updateScore, setLoading } = useAppContext();
  const [filteredScores, setFilteredScores] = useState<Score[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'total', direction: 'descending' });

  // 模拟数据
  useEffect(() => {
    if (scores.length === 0) {
      const mockData: Score[] = [
        { id: '1', studentId: '2023001', name: '张三', gradeClass: '1年级1班', math: 90, chinese: 85, english: 92, total: 267 },
        { id: '2', studentId: '2023002', name: '李四', gradeClass: '1年级1班', math: 88, chinese: 90, english: 85, total: 263 },
        { id: '3', studentId: '2023003', name: '王五', gradeClass: '1年级2班', math: 75, chinese: 82, english: 78, total: 235 },
        { id: '4', studentId: '2023004', name: '赵六', gradeClass: '1年级2班', math: 95, chinese: 88, english: 90, total: 273 },
        { id: '5', studentId: '2023005', name: '钱七', gradeClass: '2年级1班', math: 82, chinese: 78, english: 85, total: 245 },
      ];
      setScores(mockData);
      setFilteredScores(sortScores(mockData, sortConfig));
    } else {
      setFilteredScores(sortScores(scores, sortConfig));
    }
  }, [scores, setScores, sortConfig]);

  // 排序函数
  const sortScores = (scores: Score[], config: SortConfig) => {
    if (!config.direction) return scores;
    
    return [...scores].sort((a, b) => {
      if (a[config.key] < b[config.key]) {
        return config.direction === 'ascending' ? -1 : 1;
      }
      if (a[config.key] > b[config.key]) {
        return config.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  // 请求排序
  const requestSort = (key: keyof Score) => {
    let direction: 'ascending' | 'descending' | null = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // 筛选成绩信息
  const handleFilter = async () => {
    try {
      const values = await filterForm.validateFields();
      const filter: ScoreFilter = {
        studentId: values.studentId || '',
        name: values.name || '',
        gradeClass: values.gradeClass || '',
      };

      const result = scores.filter(score => {
        return (
          score.studentId.includes(filter.studentId) &&
          score.name.includes(filter.name) &&
          (filter.gradeClass === '' || score.gradeClass.includes(filter.gradeClass))
        );
      });

      setFilteredScores(sortScores(result, sortConfig));
    } catch (error) {
      message.error('筛选条件验证失败');
    }
  };

  // 重置筛选条件
  const handleResetFilter = () => {
    filterForm.resetFields();
    setFilteredScores(sortScores(scores, sortConfig));
  };

  // 打开新增成绩弹窗
  const handleAddScore = () => {
    setEditingScore(null);
    form.resetFields();
    setVisible(true);
  };

  // 打开编辑成绩弹窗
  const handleEditScore = (score: Score) => {
    setEditingScore(score);
    form.setFieldsValue({
      studentId: score.studentId,
      name: score.name,
      gradeClass: score.gradeClass,
      math: score.math,
      chinese: score.chinese,
      english: score.english,
    });
    setVisible(true);
  };

  // 计算总分
  const calculateTotal = (math: number, chinese: number, english: number) => {
    return math + chinese + english;
  };

  // 提交成绩信息
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const total = calculateTotal(values.math, values.chinese, values.english);
      
      if (editingScore) {
        // 更新成绩信息
        const updatedScore: Score = {
          ...editingScore,
          ...values,
          total,
        };
        updateScore(updatedScore);
        message.success('成绩信息更新成功');
      } else {
        // 新增成绩
        const newScore: Score = {
          id: Date.now().toString(),
          ...values,
          total,
        };
        addScore(newScore);
        message.success('成绩信息添加成功');
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
      title: '年级班级',
      dataIndex: 'gradeClass',
      key: 'gradeClass',
      width: 120,
      filters: [
        { text: '1年级1班', value: '1年级1班' },
        { text: '1年级2班', value: '1年级2班' },
        { text: '2年级1班', value: '2年级1班' },
      ],
      onFilter: (value: string, record: Score) => record.gradeClass === value,
    },
    {
      title: (
        <Space>
          <span>数学</span>
          {sortConfig.key === 'math' && (
            sortConfig.direction === 'ascending' ? 
            <SortAscendingOutlined style={{ fontSize: 12 }} /> : 
            <SortDescendingOutlined style={{ fontSize: 12 }} />
          )}
        </Space>
      ),
      dataIndex: 'math',
      key: 'math',
      width: 100,
      sorter: true,
      sortOrder: sortConfig.key === 'math' ? (sortConfig.direction === 'ascending' ? 'ascend' : 'descend') : undefined,
      onHeaderCell: () => ({
        onClick: () => requestSort('math'),
        style: { cursor: 'pointer' },
      }),
      render: (math: number) => {
        let color = 'black';
        if (math >= 90) color = 'green';
        else if (math >= 60) color = 'black';
        else color = 'red';
        return <span style={{ color }}>{math}</span>;
      },
    },
    {
      title: (
        <Space>
          <span>语文</span>
          {sortConfig.key === 'chinese' && (
            sortConfig.direction === 'ascending' ? 
            <SortAscendingOutlined style={{ fontSize: 12 }} /> : 
            <SortDescendingOutlined style={{ fontSize: 12 }} />
          )}
        </Space>
      ),
      dataIndex: 'chinese',
      key: 'chinese',
      width: 100,
      sorter: true,
      sortOrder: sortConfig.key === 'chinese' ? (sortConfig.direction === 'ascending' ? 'ascend' : 'descend') : undefined,
      onHeaderCell: () => ({
        onClick: () => requestSort('chinese'),
        style: { cursor: 'pointer' },
      }),
      render: (chinese: number) => {
        let color = 'black';
        if (chinese >= 90) color = 'green';
        else if (chinese >= 60) color = 'black';
        else color = 'red';
        return <span style={{ color }}>{chinese}</span>;
      },
    },
    {
      title: (
        <Space>
          <span>英语</span>
          {sortConfig.key === 'english' && (
            sortConfig.direction === 'ascending' ? 
            <SortAscendingOutlined style={{ fontSize: 12 }} /> : 
            <SortDescendingOutlined style={{ fontSize: 12 }} />
          )}
        </Space>
      ),
      dataIndex: 'english',
      key: 'english',
      width: 100,
      sorter: true,
      sortOrder: sortConfig.key === 'english' ? (sortConfig.direction === 'ascending' ? 'ascend' : 'descend') : undefined,
      onHeaderCell: () => ({
        onClick: () => requestSort('english'),
        style: { cursor: 'pointer' },
      }),
      render: (english: number) => {
        let color = 'black';
        if (english >= 90) color = 'green';
        else if (english >= 60) color = 'black';
        else color = 'red';
        return <span style={{ color }}>{english}</span>;
      },
    },
    {
      title: (
        <Space>
          <span>总分</span>
          {sortConfig.key === 'total' && (
            sortConfig.direction === 'ascending' ? 
            <SortAscendingOutlined style={{ fontSize: 12 }} /> : 
            <SortDescendingOutlined style={{ fontSize: 12 }} />
          )}
        </Space>
      ),
      dataIndex: 'total',
      key: 'total',
      width: 100,
      sorter: true,
      sortOrder: sortConfig.key === 'total' ? (sortConfig.direction === 'ascending' ? 'ascend' : 'descend') : undefined,
      onHeaderCell: () => ({
        onClick: () => requestSort('total'),
        style: { cursor: 'pointer' },
      }),
      render: (total: number) => {
        let color = 'black';
        if (total >= 270) color = 'green';
        else if (total >= 180) color = 'black';
        else color = 'red';
        return <span style={{ color }}>{total}</span>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Score) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditScore(record)}
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
      <div className="score-manage-container">
        <div className="score-manage-header">
          <Title level={2}>学生成绩管理</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddScore}
          >
            录入成绩
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
            <Form.Item name="gradeClass" label="年级班级">
              <Select placeholder="请选择年级班级" style={{ width: 180 }}>
                <Option value="1年级1班">1年级1班</Option>
                <Option value="1年级2班">1年级2班</Option>
                <Option value="2年级1班">2年级1班</Option>
                <Option value="2年级2班">2年级2班</Option>
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
            dataSource={filteredScores}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
        </Card>
      </div>
      
      {/* 新增/编辑成绩弹窗 */}
      <Modal
        title={editingScore ? '编辑成绩信息' : '录入成绩'}
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
        <Form form={form} layout="vertical" name="score_form">
          <Form.Item
            name="studentId"
            label="学号"
            rules={[
              { required: true, message: '请输入学号' },
              { max: 20, message: '学号最多20个字符' },
            ]}
          >
            <Input placeholder="请输入学号" disabled={!!editingScore} />
          </Form.Item>
          <Form.Item
            name="name"
            label="姓名"
            rules={[
              { required: true, message: '请输入姓名' },
              { max: 20, message: '姓名最多20个字符' },
            ]}
          >
            <Input placeholder="请输入姓名" disabled={!!editingScore} />
          </Form.Item>
          <Form.Item
            name="gradeClass"
            label="年级班级"
            rules={[{ required: true, message: '请选择年级班级' }]}
          >
            <Select placeholder="请选择年级班级">
              <Option value="1年级1班">1年级1班</Option>
              <Option value="1年级2班">1年级2班</Option>
              <Option value="2年级1班">2年级1班</Option>
              <Option value="2年级2班">2年级2班</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="math"
            label="数学"
            rules={[
              { required: true, message: '请输入数学成绩' },
              { type: 'number', min: 0, max: 100, message: '成绩必须在0-100之间' },
            ]}
          >
            <Input type="number" placeholder="请输入数学成绩" />
          </Form.Item>
          <Form.Item
            name="chinese"
            label="语文"
            rules={[
              { required: true, message: '请输入语文成绩' },
              { type: 'number', min: 0, max: 100, message: '成绩必须在0-100之间' },
            ]}
          >
            <Input type="number" placeholder="请输入语文成绩" />
          </Form.Item>
          <Form.Item
            name="english"
            label="英语"
            rules={[
              { required: true, message: '请输入英语成绩' },
              { type: 'number', min: 0, max: 100, message: '成绩必须在0-100之间' },
            ]}
          >
            <Input type="number" placeholder="请输入英语成绩" />
          </Form.Item>
          <Form.Item>
            <Form.Item
              name="total"
              label="总分"
              rules={[{ required: true, message: '总分会自动计算' }]}
            >
              <Input disabled placeholder="总分会自动计算" />
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  );
};

export default ScoreManage;