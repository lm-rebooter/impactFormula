import { addRule, removeRule, rule, updateRule } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProFormTextArea,
  ProTable,
  ProForm,
  ProFormSelect,
  ProCard,
  ProFormDatePicker,
} from '@ant-design/pro-components';
import { Button, message, Form, DatePicker, Space, Select } from 'antd';
import React, { useRef, useState } from 'react';
import scaleIcon from './assets/scale.svg';
import leafsIcon from './assets/leafs.svg';
import carIcon from './assets/car.svg';
import waterIcon from './assets/water.svg';
import treeIcon from './assets/tree.svg';
import electricityIcon from './assets/electricity.svg';
import gasIcon from './assets/gas.svg';
import UploadModal from './Components/UploadModal';
import styles from './index.module.less';

const { RangePicker } = DatePicker;

const filterOptions = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Period', value: 'period' },
];

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const [type, setType] = useState<string>();
  const [filterParams, setFilterParams] = useState<any>({});
  const [form] = Form.useForm();

  // 获取所有可用的 Site 和 Area 选项
  const siteOptions = React.useMemo(() => {
    const sites = new Set();
    const areas = new Set();
    // 这里可以从 mock 数据中获取，实际项目中应该从后端获取
    for (let i = 0; i < 10; i++) {
      sites.add(`Site ${String.fromCharCode(65 + i)}`);
      areas.add(`Area ${i + 1}`);
    }
    return {
      sites: Array.from(sites).map((site) => ({ label: site, value: site })),
      areas: Array.from(areas).map((area) => ({ label: area, value: area })),
    };
  }, []);

  // 动态columns
  const [currentType, setCurrentType] = useState('period');
  const isMonthly = currentType === 'monthly';
  console.log(isMonthly, 'isMonthly???');

  const columnsWeekly: ProColumns[] = [
    { title: 'Date', dataIndex: 'date', valueType: 'date', sorter: true },
    { title: 'Month', dataIndex: 'month', valueType: 'text', sorter: true },
    { title: 'Site', dataIndex: 'site', valueType: 'text', sorter: true },
    { title: 'Weight', dataIndex: 'weight', valueType: 'digit', sorter: true },
    { title: 'Requests', dataIndex: 'requests', valueType: 'digit', sorter: true },
    {
      title: 'Fulfilled Requests',
      dataIndex: 'fulfilledRequests',
      valueType: 'digit',
      sorter: true,
    },
    { title: 'Title', dataIndex: 'title', valueType: 'text', sorter: true },
    { title: 'Area', dataIndex: 'area', valueType: 'text', sorter: true },
    { title: 'No. of Links', dataIndex: 'links', valueType: 'digit', sorter: true },
    { title: 'Impressions', dataIndex: 'impressions', valueType: 'digit', sorter: true },
    { title: 'Saved ($)', dataIndex: 'saved', valueType: 'digit', sorter: true },
  ];

  const columnsMonthly: ProColumns[] = [
    { title: 'Month', dataIndex: 'month', valueType: 'text', sorter: true },
    { title: 'Site', dataIndex: 'site', valueType: 'text', sorter: true },
    { title: 'Food Saved', dataIndex: 'foodSaved', valueType: 'text', sorter: true },
    { title: 'CO2 Saved', dataIndex: 'co2Saved', valueType: 'text', sorter: true },
    { title: 'Requests', dataIndex: 'requests', valueType: 'digit', sorter: true },
    {
      title: 'Fulfilled Requests',
      dataIndex: 'fulfilledRequests',
      valueType: 'text',
      sorter: true,
    },
    {
      title: 'Families Benefitted',
      dataIndex: 'familiesBenefitted',
      valueType: 'text',
      sorter: true,
    },
    { title: 'No. of Links', dataIndex: 'links', valueType: 'digit', sorter: true },
    { title: 'Saved ($)', dataIndex: 'saved', valueType: 'digit', sorter: true },
    {
      title: 'Download Report',
      dataIndex: 'download',
      render: (_: unknown, record: any) => (
        <Button
          type="link"
          aria-label="Download Report"
          tabIndex={0}
          onClick={() => handleDownload(record)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleDownload(record);
          }}
        >
          Download
        </Button>
      ),
    },
  ];

  const columns = currentType === 'monthly' ? columnsMonthly : columnsWeekly;

  const handleDownload = (record: any) => {
    // Replace with actual download logic
    // For example: window.open(`/api/download?id=${record.key}`)
    message.success(`Downloaded report: ${record.title || record.key}`);
  };

  const handleExport = () => {
    // TODO: Implement period export logic
    message.info('EXPORT');
  };

  const handleExportByDaySite = () => {
    // TODO: Implement period export by day and site logic
    message.info('EXPORT BY DAY AND SITE');
  };

  const handleQuery = (values: any) => {
    console.log(form.getFieldsValue(), 'form???');
    console.log(values, 'values???');
    const values1 = form.getFieldsValue();
    rule(values1).then((res: any) => {
      console.log(res, 'res???');
    });
  };
  const handleReset = () => {
    form.resetFields();
    console.log('reset???');
  };

  return (
    <PageContainer>
      <Form
        form={form}
        layout="inline"
        className={styles.filterForm}
        initialValues={{ type: 'period' }}
        onFinish={handleQuery}
        onReset={handleReset}
      >
        <Form.Item label="Type" name="type">
          <Select
            allowClear
            showSearch
            placeholder="Select type"
            onChange={(val: string) => {
              console.log(val, 'val???');
              setCurrentType(val);
              if (val !== 'monthly') {
                form.setFieldsValue({
                  startTime: undefined,
                  endTime: undefined,
                  monthRange: undefined,
                });
              }
            }}
            options={filterOptions}
            style={{ minWidth: 300, flex: 1 }}
          />
        </Form.Item>

        {form.getFieldValue('type') === 'period' && (
          <Form.Item
            label="Range"
            name="monthRange"
            rules={[{ required: true, message: 'Please select month range' }]}
          >
            <RangePicker
              picker="month"
              style={{ width: 320 }}
              placeholder={['Start Month', 'End Month']}
              allowClear={false}
              onChange={(_dates: any, dateStrings: [string, string]) => {
                form.setFieldsValue({
                  startTime: dateStrings[0],
                  endTime: dateStrings[1],
                });
              }}
            />
          </Form.Item>
        )}

<Form.Item label="Site" name="site">
          <Select
            allowClear
            showSearch
            placeholder="Please select site"
          
            options={siteOptions.sites}
            style={{ minWidth: 300, flex: 1 }}
          />
        </Form.Item>


        {form.getFieldValue('type') === 'period' && (
          <Form.Item
            label="Area"
            name="area"
            rules={[{ required: true, message: 'Please select area' }]}
          >
           <Select
            allowClear
            showSearch
            placeholder="Please select area"
          
            options={siteOptions.areas}
            style={{ minWidth: 300, flex: 1 }}
          />
          </Form.Item>
        )}
   
        <Form.Item>
          <Button htmlType="reset" style={{ marginRight: 8 }}>
            Reset
          </Button>
         
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Query
          </Button>
          {currentType === 'period' && (
            <>
              <Button onClick={handleExport} key="export" style={{ marginRight: 8 }}>
                EXPORT
              </Button>
              <Button onClick={handleExportByDaySite} key="exportByDaySite" style={{ marginRight: 8 }}>
                EXPORT BY DAY AND SITE
              </Button>
            </>
          )}
         
          <UploadModal
            onUpdate={() => {
              // onSearch();
            }}
          />
        </Form.Item>
      </Form>


      <ProCard
        gutter={[{ xs: 8, sm: 8, md: 12, lg: 16, xl: 20 }, 12]}
        style={{ marginBlockStart: 12, background: 'transparent' }}
        bodyStyle={{ padding: 0, background: 'transparent' }}
      >
        <ProCard
          bordered
          style={{
            borderRadius: 12,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            minWidth: 180,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            padding: '0 18px',
            margin: 0,
            background: '#fff',
          }}
          bodyStyle={{ padding: 0, height: 64, display: 'flex', alignItems: 'center' }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#e6f4f1',
              marginRight: 12,
              flexShrink: 0,
            }}
          >
            <img src={scaleIcon} alt="Total Food Rescued Icon" style={{ width: 18, height: 18 }} />
          </span>
          <div
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}
          >
            <span style={{ fontSize: 14, color: '#222', fontWeight: 500, lineHeight: 1.1 }}>
              Total Food Rescued
            </span>
            <span style={{ fontSize: 17, fontWeight: 600, marginTop: 2, letterSpacing: 0.5 }}>
              18,973 KG
            </span>
          </div>
        </ProCard>

        <ProCard
          bordered
          style={{
            borderRadius: 12,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            minWidth: 180,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            padding: '0 18px',
            margin: 0,
            background: '#fff',
          }}
          bodyStyle={{ padding: 0, height: 64, display: 'flex', alignItems: 'center' }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#e6f4f1',
              marginRight: 12,
              flexShrink: 0,
            }}
          >
            <img src={leafsIcon} alt="CO2 Saved Icon" style={{ width: 18, height: 18 }} />
          </span>
          <div
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}
          >
            <span style={{ fontSize: 14, color: '#222', fontWeight: 500, lineHeight: 1.1 }}>
              C02 Saved
            </span>
            <span style={{ fontSize: 17, fontWeight: 600, marginTop: 2, letterSpacing: 0.5 }}>
              5,190 kg
            </span>
          </div>
        </ProCard>

        <ProCard
          bordered
          style={{
            borderRadius: 12,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            minWidth: 180,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            padding: '0 18px',
            margin: 0,
            background: '#fff',
          }}
          bodyStyle={{ padding: 0, height: 64, display: 'flex', alignItems: 'center' }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#e6f4f1',
              marginRight: 12,
              flexShrink: 0,
            }}
          >
            <img src={waterIcon} alt="Water Saved Icon" style={{ width: 18, height: 18 }} />
          </span>
          <div
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}
          >
            <span style={{ fontSize: 14, color: '#222', fontWeight: 500, lineHeight: 1.1 }}>
              Water Saved
            </span>
            <span style={{ fontSize: 17, fontWeight: 600, marginTop: 2, letterSpacing: 0.5 }}>
              736,000 litres
            </span>
          </div>
        </ProCard>
        <ProCard
          bordered
          style={{
            borderRadius: 12,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            minWidth: 180,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            padding: '0 18px',
            margin: 0,
            background: '#fff',
          }}
          bodyStyle={{ padding: 0, height: 64, display: 'flex', alignItems: 'center' }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#e6f4f1',
              marginRight: 12,
              flexShrink: 0,
            }}
          >
            <img src={treeIcon} alt="Equiv Trees Planted Icon" style={{ width: 18, height: 18 }} />
          </span>
          <div
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}
          >
            <span style={{ fontSize: 14, color: '#222', fontWeight: 500, lineHeight: 1.1 }}>
              Equiv Trees Planted
            </span>
            <span style={{ fontSize: 17, fontWeight: 600, marginTop: 2, letterSpacing: 0.5 }}>
              108
            </span>
          </div>
        </ProCard>
      </ProCard>

      <ProCard
        gutter={[{ xs: 8, sm: 8, md: 12, lg: 16, xl: 20 }, 12]}
        style={{ marginBlockStart: 12, background: 'transparent' }}
        bodyStyle={{ padding: 0, background: 'transparent' }}
      >
        <ProCard
          bordered
          style={{
            borderRadius: 12,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            minWidth: 180,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            padding: '0 18px',
            margin: 0,
            background: '#fff',
          }}
          bodyStyle={{ padding: 0, height: 64, display: 'flex', alignItems: 'center' }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#e6f4f1',
              marginRight: 12,
              flexShrink: 0,
            }}
          >
            <img src={carIcon} alt="Car KM Off The Road Icon" style={{ width: 18, height: 18 }} />
          </span>
          <div
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}
          >
            <span style={{ fontSize: 14, color: '#222', fontWeight: 500, lineHeight: 1.1 }}>
              Car KM Off The Road
            </span>
            <span style={{ fontSize: 17, fontWeight: 600, marginTop: 2, letterSpacing: 0.5 }}>
              24,143
            </span>
          </div>
        </ProCard>
        <ProCard
          bordered
          style={{
            borderRadius: 12,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            minWidth: 180,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            padding: '0 18px',
            margin: 0,
            background: '#fff',
          }}
          bodyStyle={{ padding: 0, height: 64, display: 'flex', alignItems: 'center' }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#e6f4f1',
              marginRight: 12,
              flexShrink: 0,
            }}
          >
            <img
              src={electricityIcon}
              alt="Electricity Saved Icon"
              style={{ width: 18, height: 18 }}
            />
          </span>
          <div
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}
          >
            <span style={{ fontSize: 14, color: '#222', fontWeight: 500, lineHeight: 1.1 }}>
              Electricity Saved
            </span>
            <span style={{ fontSize: 17, fontWeight: 600, marginTop: 2, letterSpacing: 0.5 }}>
              6,499 kWh
            </span>
          </div>
        </ProCard>
        <ProCard
          bordered
          style={{
            borderRadius: 12,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            minWidth: 180,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            padding: '0 18px',
            margin: 0,
            background: '#fff',
          }}
          bodyStyle={{ padding: 0, height: 64, display: 'flex', alignItems: 'center' }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#e6f4f1',
              marginRight: 12,
              flexShrink: 0,
            }}
          >
            <img src={gasIcon} alt="Natural Gas Saved Icon" style={{ width: 18, height: 18 }} />
          </span>
          <div
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}
          >
            <span style={{ fontSize: 14, color: '#222', fontWeight: 500, lineHeight: 1.1 }}>
              Natural Gas Saved
            </span>
            <span style={{ fontSize: 17, fontWeight: 600, marginTop: 2, letterSpacing: 0.5 }}>
              967 litres
            </span>
          </div>
        </ProCard>
      </ProCard>

      <ProTable<API.RuleListItem, API.PageParams>
        actionRef={actionRef}
        rowKey="key"
        search={false}
        options={false}
        toolBarRender={false}
        params={filterParams}
        request={async (params, sorter, filter) => {
          return rule(params);
        }}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
