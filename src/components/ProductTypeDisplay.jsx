import '../App.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import axios from "axios"
import { BaseImgUrl, BaseUrl } from "../environment";
import { Form, InputNumber, Popconfirm, Typography, Input, Space, Table, Card, Button, Dropdown, Avatar, Tag, Upload } from 'antd';
import { EditTwoTone, DeleteTwoTone, EditOutlined, DeleteOutlined, UserOutlined, SmileOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import AddProductType from './AddProductType';
import TestDemo from './TestDemo';
const { Text } = Typography;



const ProductTypeDisplay = () => {

  const iconStyle = { fontSize: "1.4rem" }

  const [form] = Form.useForm()
  const [products, setProducts] = useState([])
  const [editingId, setEditingId] = useState('')
  const [image, setImage] = useState(null)
  const [disable, setDisable] = useState(true)

  const isEditing = (record) => record.id === editingId;

  useEffect(() => {
    axios.get(`${BaseUrl}products`)
      .then(res => {
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
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            onChange={onTextChange}
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

  const onTextChange = () => {
    setDisable(false);
    console.log("textChange")
  }

  const handleCancel = () => {
    setDisable(true)
    setEditingId('')
  }

  /* 在可编辑行table当中生成添加新数据的input表单 */
  // const handleAddProductType = () => {
  //   if (!addRowId) {
  //     const newData = { id: `${Math.random()}` }
  //     setAddRowId(newData.id)
  //     setEditingId(newData.id);
  //     setProducts([newData, ...products]);
  //   } else {
  //     const index = products.findIndex((product) => addRowId === product.id);
  //     products.splice(index, 1)
  //     setAddRowId('')
  //     setEditingId('')
  //     setProducts([...products])
  //   }
  // }


  /* 删除数据相关 */
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


  /* 修改数据相关 */
  const handleEditProductType = (record) => {
    form.setFieldsValue({ ...record });
    setEditingId(record.id);
  };

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
        setDisable(true)
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
            <Button type='text' disabled={disable} onClick={() => editSubmit(record)}>
              <CheckOutlined style={iconStyle} />
            </Button>

            <Button type='text' onClick={handleCancel}>
              <CloseOutlined style={iconStyle} />
            </Button>

          </Space>
        ) : (
          <Space >
            <Button type="text" disabled={editingId !== ''} onClick={() => handleEditProductType(record)}>
              <EditOutlined style={iconStyle} />
            </Button>
            <Popconfirm title="Are you sure to delete this product?" description={<br />} okText="Yes" cancelText="No" onConfirm={() => handleDelProductType(record)}>
              <Button type="text" disabled={editingId !== ''} >
                <DeleteOutlined style={iconStyle} />
              </Button>
            </Popconfirm>
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
      {/* <TestDemo /> */}
      <Dropdown menu={{ items }}>
        <Avatar size="large" icon={<UserOutlined />} style={{ backgroundColor: 'skyblue' }} />
      </Dropdown>
      <h1>Product Type Management</h1>

      <Form form={form} component={false}>
        <AddProductType
          products={products}
          setProducts={setProducts}
        />
        <Table
          rowKey="id"
          dataSource={products}
          columns={mergedColumns}
          expandable={{ expandedRowRender }}
          components={{ body: { cell: EditableCell } }}
          pagination={{ onChange: handleCancel, defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: [5, 10, 20, 50], total: products.length, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items` }}
        />
      </Form>
    </Card>
  )
}

export default ProductTypeDisplay