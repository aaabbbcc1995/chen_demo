import './dashboardPage.css';
import {Empty, InputNumber, Modal, Space, Table, Tag} from "antd";
import {useState, useEffect, useRef} from "react";
import {BarChart, XAxis, YAxis, Tooltip, PieChart, Bar, Pie} from 'recharts';

export default function DashboardPage() {
  const [data, setData] = useState(JSON.parse(localStorage.getItem('saleData')) || []);
  const [open, setOpen] = useState(false);
  const [dataIndex, setDataIndex] = useState();
  const windowWidth = ContainerWidth('order-chart');
  const windowWidth2 = ContainerWidth('order-chart2');
  const numberRef=  useRef();

  useEffect(() => {
    localStorage.setItem('saleData', JSON.stringify(data));
  }, [data]);

  const okClick = ()=>{
    setOpen(false);
    setData(updatePrice(dataIndex, numberRef.current.value))
  }

  const closeClick = ()=>{
    setOpen(false);
  }

  function updatePrice(key, price) {
    const updatedPrice = data.map(item => {
      if (item.key === key) {
        return {...item, amount: price,tags: '未开始'};
      }
      return item;
    });

    return updatedPrice;
  }

  function updateDataToPending(key, status) {
    const updatedDataToPending = data.map(item => {
      if (item.key === key) {
        return {...item, tags: status};
      }
      return item;
    });

    return updatedDataToPending;
  }

  function transformData(data) {
    let result = [];
    let tagCount = {};

    data.forEach(item => {
      if (tagCount[item.tags]) {
        tagCount[item.tags]++;
      } else {
        tagCount[item.tags] = 1;
      }
    });

    for (let tag in tagCount) {
      result.push({ name: tag, amount: tagCount[tag] });
    }

    return result;
  }

  function convertDataToObjects(data) {
    // 创建一个空数组来存储转换后的对象
    let result = [];

    // 创建一个空对象来存储每个'tags'值对应的总'amount'值
    let amounts = {};

    // 遍历给定的数据数组
    for (let i = 0; i < data.length; i++) {
      let obj = data[i];
      let tags = obj.tags;
      let amount = parseFloat(obj.amount);

      // 如果当前'tags'值在amounts对象中不存在，则创建一个新的键值对
      if (!amounts[tags]) {
        amounts[tags] = amount;
      }
      // 如果当前'tags'值已经存在于amounts对象中，则将当前的'amount'值累加到已有的值上
      else {
        amounts[tags] += amount;
      }
    }

    // 将amounts对象转换为对象数组，并将'name'和'amount'字段赋值
    for (let tags in amounts) {
      result.push({ name: tags, amount: amounts[tags] });
    }

    return result;
  }

  function calculateTotalAmount(dataArray) {
    let totalAmount = 0;
    for (let i = 0; i < dataArray.length; i++) {
      totalAmount += parseInt(dataArray[i].amount);
    }
    return totalAmount;
  }

  function getAmountByName(data, name) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].name === name) {
        return data[i].amount;
      }
    }
    return null; // 如果找不到匹配的'name'，返回null或其他适当的值
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
          <Tag color={tags==='审批中'? 'yellow':tags === '未开始' ? 'red' : tags === '已完成' ? 'green' : 'blue'} key={tags}>
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
              <a onClick={()=> {
                setOpen(true);
                setDataIndex(record.key);
              }}>审批报价</a> : record.tags === '未开始' ?
                <a onClick={() => {setData(updateDataToPending(record.key, '进行中'))}}>
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
    <div className='dashboard-page'>
      <Modal
        title="订单审批"
        open={open}
        destroyOnClose={true}
        onCancel={closeClick}
        onOk={okClick}
        okText='确认'
        cancelText='取消'
        centered
      >
        <div style={{display: 'flex', flexDirection: 'column'}}>
          最低报价
          <InputNumber min={1} max={1000000000} defaultValue={3} style={{width: '400px'}} ref={numberRef}/>
        </div>
      </Modal>
      <div  className='dashboard-page-container-header'>
        <div className='dashboard-page-container2' id='order-chart' style={{width: '400px'}}>
          {
            data?.length > 0?
              <>
                <div style={{fontSize: '20px', textAlign: 'left', marginBottom: '20px'}}>
                  订单详情
                </div>
                <BarChart width={windowWidth} height={320} data={transformData(data)}
                          margin={{top: 10, right: 30, left: -20, bottom: 0}}>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke='#8884d8' axisLine={true} tickLine={true}/>
                  <YAxis dataKey="amount" stroke='#8884d8' axisLine={true} tickLine={true}/>
                  <Tooltip cursor={false} contentStyle={{borderRadius: '5px', background: 'black', border: 'none', color: "white"}} labelStyle={{color: 'white'}}/>
                  <Bar dataKey="amount" fill="url(#colorUv)" />
                </BarChart>
              </>:
              <Empty/>
          }
        </div>
        <div className='dashboard-page-container3' id='order-chart2'>
          {data.length > 0?
            <>
              <div style={{display: 'flex', flexDirection: 'column', width: '40%', fontSize: '14px', textAlign: 'left'}}>
                <div>
                  总金额: {calculateTotalAmount(data)}
                </div>
                <div>
                  审批中: {getAmountByName(convertDataToObjects(data), '审批中') || 0}
                </div>
                <div>
                  未开始: {getAmountByName(convertDataToObjects(data), '未开始') || 0}
                </div>
                <div>
                  进行中: {getAmountByName(convertDataToObjects(data), '进行中') || 0}
                </div>
                <div>
                  已完成: {getAmountByName(convertDataToObjects(data), '已完成') || 0}
                </div>
              </div>
              <PieChart width={windowWidth2/2} height={250}>
                <Pie data={convertDataToObjects(data)} dataKey="amount" nameKey="name"  fill="#82ca9d" label />
                <Tooltip contentStyle={{background: 'white'}}/>
              </PieChart>
            </>
            :
            <Empty />
          }
        </div>
      </div>

      <div className='dashboard-page-container'>
        <div className='dashboard-page-container-text' style={{color: '#d4b106'}}>
          审批中
        </div>
        <Table columns={columns} dataSource={data.filter(item => item.tags === "审批中")}/>
      </div>
      <div className='dashboard-page-container'>
        <div className='dashboard-page-container-text'>
          未开始
        </div>
        <Table columns={columns} dataSource={data.filter(item => item.tags === "未开始")}/>
      </div>
      <div className='dashboard-page-container'>
        <div className='dashboard-page-container-text' style={{color: 'green'}}>
          进行中
        </div>
        <Table columns={columns} dataSource={data.filter(item => item.tags === "进行中")}/>
      </div>
      <div className='dashboard-page-container'>
        <div className='dashboard-page-container-text' style={{color: 'blue'}}>
          已完成
        </div>
        <Table columns={columns} dataSource={data.filter(item => item.tags === "已完成")}/>
      </div>
    </div>
  )
}

const ContainerWidth = (containerId) => {
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const width = document.getElementById(containerId).clientWidth;
      setContainerWidth(width);
    };

    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);

    // 初始化时获取容器宽度
    handleResize();

    // 在组件卸载时移除事件监听
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return containerWidth - 80;
};