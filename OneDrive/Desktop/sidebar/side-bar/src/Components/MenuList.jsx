import { Menu } from 'antd'; 
import { HomeOutlined, FileSearchOutlined, UsergroupAddOutlined, SettingOutlined } from "@ant-design/icons";
import { useState } from 'react';

const MenuList = ({ darkTheme }) => {
  const [selectedKeys, setSelectedKeys] = useState(['home']);

  const handleClick = (e) => {
    setSelectedKeys([e.key]);
  };

  return ( 
    <Menu
      theme={darkTheme ? 'dark' : 'light'}
      mode="inline"
      className='menu-bar'
      selectedKeys={selectedKeys}
      onClick={handleClick}
      style={{ backgroundColor: darkTheme ? '#001529' : '#fafafa', color: darkTheme ? '#fff' : '#000', selectedTextColor: '#00FF00' }} // Change selectedTextColor to green
    >
      <Menu.Item key="home" icon={<HomeOutlined />}>
        Newsfeed
      </Menu.Item>
      <Menu.Item key="explore" icon={<FileSearchOutlined />}>
        Explore
      </Menu.Item>
      <Menu.Item key="group" icon={<UsergroupAddOutlined />}>
        Group
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
    </Menu>
  );
};

export default MenuList;
