import './storePage.css';
import {useEffect, useState} from "react";
import {Empty} from "antd";

export default function StorePage(){
  const [data, setData] = useState(JSON.parse(localStorage.getItem('saleData')) || []);

  useEffect(() => {
    localStorage.setItem('saleData', JSON.stringify(data));
  }, [data]);

  return(
    <div className='store-page'>
      {data?.length === 0 && <Empty/>}
      {data.map(item => (
        <div key={item.key} style={{display:'flex', flexDirection:'row', fontSize: '16px', fontWeight: 'bold'}}>
          <p>订单名: {item.name}&nbsp;&nbsp;</p>
          <p>零件需求: {item.require.join(', ')}</p>
        </div>
      ))}
    </div>
  )
}