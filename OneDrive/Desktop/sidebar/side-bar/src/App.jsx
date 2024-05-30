// App.jsx
import React, { useState } from 'react';
import { Layout, Button } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import Logo from "./Components/Logo";
import MenuList from './Components/MenuList';
import ToggleThemeButton from "./Components/ToggleThemeButton";

const { Header, Sider } = Layout;

function App() {
  const [darkTheme, setDarkTheme] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout>
      <Sider collapsed={collapsed} collapsible trigger={null} theme={darkTheme ? 'dark' : 'light'} className="sidebar">
        <Logo collapsed={collapsed} /> {/* Pass the collapsed state to the Logo component */}
        <MenuList darkTheme={darkTheme} />
        <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#f0f2f5' }}> {/* Added a background color for visibility */}
          <Button type="text" className="toggle" onClick={toggleCollapsed} icon={collapsed ?
            <MenuUnfoldOutlined /> :
            <MenuFoldOutlined />} />
        </Header>
      </Layout>
    </Layout>
  );
}

export default App;
