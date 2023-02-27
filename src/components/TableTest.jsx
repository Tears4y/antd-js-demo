import '../App.css';
import { useEffect, useState } from 'react';
import axios from "axios"
import { BaseImgUrl, BaseUrl } from "../environment";
import { Form, InputNumber, Popconfirm, Typography, Input, Space, Table, Card, Button, Dropdown, Avatar, Tag } from 'antd';
import { EditTwoTone, DeleteTwoTone, EditOutlined, DeleteOutlined, UserOutlined, SmileOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
const { Text } = Typography;



const TableTest = () => {

  const iconStyle = { fontSize: "1.4rem" }

  const [form] = Form.useForm()
  const [products, setProducts] = useState([])
  const [editingId, setEditingId] = useState('')
  const [image, setImage] = useState("")
  const [editingIndex, setEditingIndex] = useState(null)
  const [editFormData, setEditFormData] = useState({
    id: '',
    category_id: '99',
    title: '',
    description: '',
    price: '',
    product_image: ''
  })

  const isEditing = (record) => record.id === editingId;

  useEffect(() => {
    axios.get(`${BaseUrl}products`)
      .then(res => {
        // console.log(res.data)
        setProducts(res.data)
      })
      .catch(err => console.log(err))
  }, [])


  /* 处理修改当前行数据时的input样式及校验 */
  const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item name={dataIndex} style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`
              }
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };


  /* 表格数据的增删改操作 */
  const handleAddProductType = () => {
    const newData = {
      id: `${Math.random()}`,
      title: "aa",
      description: "",
      price: ""
    };
    setProducts([newData, ...products]);
    setEditingId(newData.id);
    console.log("handleAddProductType")
  }

  /* 提交新增数据 */
  const addSubmit = async (record) => {
    const row = await form.validateFields();

    const userToken = localStorage.getItem('react-demo-token')
    const config = {
      headers: {
        token: userToken
      }
    }

    const formData = new FormData()
    formData.append('category_id', 99)
    row.title && formData.append('title', row.title)
    row.description && formData.append('description', row.description)
    row.price && formData.append('price', row.price)
    image && formData.append('product_image', image)

    axios.post(`${BaseUrl}products`, formData, config)
      .then(res => {
        const newData = [res.data, ...products];
        setProducts(newData)
        setEditingId('')
        console.log("add success")
      })
      .catch(err => console.log(err))
  };

  /* 提交删除数据 */
  const handleDelProductType = (record) => {
    const userToken = localStorage.getItem('react-demo-token')
    const config = {
      headers: {
        token: userToken
      }
    }

    axios.delete(`${BaseUrl}product/${record.id}`, config)
      .then(() => {
        const newData = [...products]
        const index = newData.findIndex((product) => record.id === product.id);
        newData.splice(index, 1)
        setProducts(newData)
        console.log("delete success")
      })
      .catch((err) => console.log(err))
  }

  const handleEditProductType = (record) => {
    form.setFieldsValue({ ...record });
    setEditingId(record.id);
  };

  /* 提交修改数据 */
  const editSubmit = async (record) => {
    const row = await form.validateFields();
    const formData = new FormData()

    row.title && formData.append('title', row.title)
    row.description && formData.append('description', row.description)
    row.price && formData.append('price', row.price)
    image && formData.append('product_image', image)
    formData.append('_method', 'put')

    axios.post(`${BaseUrl}product/${record.id}`, formData)
      .then(res => {
        const newData = [...products];
        const index = newData.findIndex((product) => record.id === product.id);
        newData.splice(index, 1, res.data);
        setProducts(newData)
        setEditingId('')
        console.log("edit success")
      })
      .catch(err => console.log(err))
  };

  const handleAddOrderType = () => {
    console.log("handleAddOrderType")
  }

  const handleDelOrderType = () => {
    console.log("handleDelOrderType")
  }

  const handleEditOrderType = () => {
    console.log("handleEditOrderType")
  }

  const handleAddorEditMethod = (record) => {
    if (record.id > 1) {
      editSubmit(record)
    } else {
      addSubmit(record)
    }
  }

  const handleCancel = () => setEditingId('')


  /* 用户 Menu 的处理 */
  const handleLogOut = () => {
    localStorage.removeItem('react-demo-token')
    localStorage.removeItem('react-demo-user')
    window.location.reload()
  }

  let user
  const auth = localStorage.getItem("react-demo-token")
  if (auth) {
    user = JSON.parse(localStorage.getItem("react-demo-user"))
  }

  const items = [
    {
      key: '1',
      label: (
        <Text>
          {user.email}
        </Text>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          2nd menu item (disabled)
        </a>
      ),
      icon: <SmileOutlined />,
      disabled: true,
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
          3rd menu item (disabled)
        </a>
      ),
      disabled: true,
    },
    {
      key: '4',
      danger: true,
      label: 'Log Out',
      onClick: handleLogOut
    },
  ];


  /* Table表格需要提供的columns数据 */
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      editable: true,
    },
    {
      title: 'Description',
      align: 'center',
      dataIndex: 'description',
      editable: true,
    },
    {
      title: 'Price',
      align: 'center',
      dataIndex: 'price',
      editable: true,
    },
    {
      title: 'Photo',
      align: 'center',
      dataIndex: 'product_image',
      render: (_, record) => <img src={`${BaseImgUrl}${record.product_image}`} width="100" height="80" />,
      editable: false,
    },
    {
      title: 'Action', align: 'center',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button type='text' onClick={() => handleAddorEditMethod(record)}>
              <CheckOutlined style={iconStyle} />
            </Button>
            {/* <Popconfirm title="Are you sure to delete this task?" description={<br />} okText="Yes" cancelText="No" onConfirm={() => { handleEditCancel(record.id) }}> */}
            <Button type='text' onClick={handleCancel}>
              <CloseOutlined style={iconStyle} />
            </Button>
            {/* </Popconfirm> */}
          </Space>
        ) : (
          <Space >
            <Button type="text" disabled={editingId !== ''} onClick={() => handleEditProductType(record)}>
              <EditOutlined style={iconStyle} />
            </Button>
            <Button type="text" disabled={editingId !== ''} onClick={() => handleDelProductType(record)}>
              <DeleteOutlined style={iconStyle} />
            </Button>
            <Button type="dashed" disabled={editingId !== ''} onClick={handleAddOrderType}>
              Add Order
            </Button>
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'price' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });


  /* 扩展表格相关的内容 */
  const expandedRowRender = () => {

    const data = [];
    // for (let i = 0; i < 3; ++i) {
    data.push({
      key: 0,
      order_type: 'R2P',
      sequence: 'Printing  Production  Packaging',
    });
    data.push({
      key: 1,
      order_type: 'R2S',
      sequence: 'Printing  Production ',
    });
    data.push({
      key: 2,
      order_type: 'S2P',
      sequence: ' Production  Packaging',
    });
    // }

    const columns = [
      { title: 'Order Type', dataIndex: 'order_type' },
      {
        title: 'Sequence', render: (_, render) => <Tag color="geekblue">{render.sequence}</Tag>
      },
      {
        title: 'Action',
        render: () => (
          <Space >
            <Button type="text" onClick={handleEditOrderType} >
              <EditTwoTone style={iconStyle} />
            </Button>
            <Button type="text" onClick={handleDelOrderType}>
              <DeleteTwoTone style={iconStyle} />
            </Button>
          </Space>
        ),
      },
    ];


    return <Table columns={columns} dataSource={data} pagination={false} />;
  };



  return (
    <Card>
      <Dropdown menu={{ items }}>
        <Avatar size="large" icon={<UserOutlined />} style={{ backgroundColor: 'skyblue' }} />
      </Dropdown>
      <h1>Product Type Management</h1>
      <Button type='primary' style={{ marginBottom: "0.5rem" }} onClick={handleAddProductType}>
        Add New
      </Button>
      <Form form={form} component={false}>
        <Table
          rowKey="id"
          dataSource={products}
          columns={mergedColumns}
          expandable={{ expandedRowRender }}
          components={{ body: { cell: EditableCell } }}
          pagination={{ onChange: handleCancel, defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: [5, 10, 20, 50] }}
        />
      </Form>
    </Card>
  )
}

export default TableTest