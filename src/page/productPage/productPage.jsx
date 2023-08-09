import './productPage.css';
import {Space, Table, Tag} from "antd";
import {useState, useEffect} from "react";

export default function ProductPage() {
  const [data, setData] = useState(JSON.parse(localStorage.getItem('saleData')) || []);

  useEffect(() => {
    localStorage.setItem('saleData', JSON.stringify(data));
  }, [data]);

  function updateDataToPending(key, status) {
    const updatedDataToPending = data.map(item => {
      if (item.key === key) {
        return {...item, tags: status};
      }
      return item;
    });

    return updatedDataToPending;
  }

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
          <Tag color={tags === '未开始' ? 'red' : tags === '已完成' ? 'green' : 'blue'} key={tags}>
            {tags}
          </Tag>
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {
            record.tags === '审批中' ?
              <div>审批中</div> : record.tags === '未开始' ?
                <a onClick={() => {
                  setData(updateDataToPending(record.key, '进行中'))
                }}>
                  开始
                </a>
                : record.tags === '已完成' ?
                  <div>已完成</div> :
                  <a onClick={() => {
                    setData(updateDataToPending(record.key, '已完成'));
                  }}>
                    完成
                  </a>
          }
        </Space>
      ),
    },
  ];

  return (
    <div className='product-page'>
      <div className='product-page-container'>
        <div className='product-page-container-text'>
          未开始
        </div>
        <Table columns={columns} dataSource={data.filter(item => item.tags === "未开始")}/>
      </div>
      <div className='product-page-container'>
        <div className='product-page-container-text' style={{color: 'green'}}>
          进行中
        </div>
        <Table columns={columns} dataSource={data.filter(item => item.tags === "进行中")}/>
      </div>
      <div className='product-page-container'>
        <div className='product-page-container-text' style={{color: 'blue'}}>
          已完成
        </div>
        <Table columns={columns} dataSource={data.filter(item => item.tags === "已完成")}/>
      </div>
    </div>
  )
}