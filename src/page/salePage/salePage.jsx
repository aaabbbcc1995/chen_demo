import './salePage.css';
import {Button, Modal} from "antd";
import {Table, Tag,Form, Input} from 'antd';
import {useEffect, useRef, useState} from "react";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

export default function SalePage() {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [data, setData] = useState(JSON.parse(localStorage.getItem('saleData')) || []);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(()=>{
    localStorage.setItem('saleData', JSON.stringify(data));
  },[data])

  return (
    <div className='sale-page'>
      <Modal
        title="新增订单"
        open={open}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}
        centered
      >
        <FormContent setData={setData} data={data} setOpen={setOpen}/>
      </Modal>
      <div className='sale-page-header'>
        <Button type='primary' onClick={showModal}>
          新增
        </Button>
      </div>
      <Table columns={columns} dataSource={data}/>
    </div>
  )
}

const FormContent = ({setData,data,setOpen}) =>{
  const onFinish = (values) => {
    const newData = {
      ...values,
      key: String(data?.length + 1),
      sale: '陈豪',
      date: new Date().toISOString().split('T')[0],
      tags: '审批中',
    }
    setData([...data,newData]);
    setOpen(false);
  };

  return (
    <Form
      name="dynamic_form_item"
      {...formItemLayoutWithOutLabel}
      onFinish={onFinish}
      preserve={false}
      style={{
        maxWidth: 600,
      }}
    >
      <Form.Item {...formItemLayout} name='name' label="订单名" rules={[{ required: true, message:'请填写订单名'}]}>
        <Input />
      </Form.Item>
      <Form.Item {...formItemLayout} name='amount' label="订单价" rules={[{ required: true, message: '请填写订单价' }]}>
        <Input />
      </Form.Item>
      <Form.List
        name="require"
        rules={[
          {
            validator: async (_, require) => {
              if (!require || require.length === 0) {
                return Promise.reject(new Error('至少添加一个零件'));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                label={index === 0 ? '需要零件' : ''}
                required={true}
                key={field.key}
              >
                <Form.Item
                  {...field}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "输入需要的零件和数量",
                    },
                  ]}
                  noStyle
                >
                  <Input
                    placeholder="输入零件名和数量"
                    style={{
                      width: '60%',
                    }}
                  />
                </Form.Item>
                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                  />
                ) : null}
              </Form.Item>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{
                  width: '60%',
                }}
                icon={<PlusOutlined />}
              >
                增加零件
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
}

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 20,
    },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 20,
      offset: 4,
    },
  },
};

const columns = [
  {
    title: '订单名',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: '创建日期',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '销售人员',
    dataIndex: 'sale',
    key: 'sale',
  },
  {
    title: '订单价',
    dataIndex: 'amount',
    key: 'amount',
    render: (text) => <>$ {text}</>
  },
  {
    title: '零件需求',
    dataIndex: 'require',
    key: 'require',
    render: (_, {require}) => (
      <>
        {
          require?.map((item, index) => {
            return (
              <div key={index}>
                {item}
              </div>
            )
          })
        }
      </>
    )
  },
  {
    title: '进度',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, {tags}) => (
      <>
        <Tag color={tags==='审批中'? 'yellow':tags === '未开始' ? 'red' : tags === '已完成' ? 'green' : 'blue'} key={tags}>
          {tags}
        </Tag>
      </>
    ),
  }
];