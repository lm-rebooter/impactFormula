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
  ProFormDatePicker,
} from '@ant-design/pro-components';
import { Button, message, Form, DatePicker, Space } from 'antd';
import React, { useRef, useState } from 'react';

const { RangePicker } = DatePicker;

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
      sites: Array.from(sites).map(site => ({ label: site, value: site })),
      areas: Array.from(areas).map(area => ({ label: area, value: area }))
    };
  }, []);

  // 动态columns
  const [currentType, setCurrentType] = useState('period');
  const isMonthly = currentType === 'monthly';
  console.log(isMonthly,'isMonthly???')

  const columnsWeekly: ProColumns[] = [
    { title: 'Date', dataIndex: 'date', valueType: 'date', sorter: true },
    { title: 'Month', dataIndex: 'month', valueType: 'text', sorter: true },
    { title: 'Site', dataIndex: 'site', valueType: 'text', sorter: true },
    { title: 'Weight', dataIndex: 'weight', valueType: 'digit', sorter: true },
    { title: 'Requests', dataIndex: 'requests', valueType: 'digit', sorter: true },
    { title: 'Fulfilled Requests', dataIndex: 'fulfilledRequests', valueType: 'digit', sorter: true },
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
    { title: 'Fulfilled Requests', dataIndex: 'fulfilledRequests', valueType: 'text', sorter: true },
    { title: 'Families Benefitted', dataIndex: 'familiesBenefitted', valueType: 'text', sorter: true },
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
          onKeyDown={e => { if (e.key === 'Enter') handleDownload(record); }}
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

  return (
    <PageContainer>
      <ProForm
        form={form}
        layout="horizontal"
        grid
        rowProps={{ gutter: [24, 16] }}
        initialValues={{ type: 'period' }}
        onFinish={values => {
          setFilterParams(values);
        }}
        onReset={() => {
          setFilterParams({});
        }}
        onValuesChange={(changed, all) => {
          if ('type' in changed) setCurrentType(changed.type);
        }}
        submitter={{
          render: (props, doms) => (
            <Space size={16} style={{ margin: '8px 0' }}>
              {doms[0]}
              {doms[1]}
              {currentType === 'period' && <>
                <Button onClick={handleExport} key="export">EXPORT</Button>
                <Button onClick={handleExportByDaySite} key="exportByDaySite">EXPORT BY DAY AND SITE</Button>
              </>}
            </Space>
          ),
        }}
      >
        <ProFormSelect
          name="type"
          label="Type"
          initialValue="period"
          rules={[{ required: true, message: 'Please select type' }]}
          options={[
            { label: 'Period', value: 'period' },
            { label: 'Monthly', value: 'monthly' },
          ]}
          colProps={{ span: 6 }}
          fieldProps={{
            allowClear: false,
            onChange: (val: string) => {
              if (val !== 'monthly') {
                form.setFieldsValue({ startTime: undefined, endTime: undefined, monthRange: undefined });
              }
            },
          }}
        />
        <Form.Item shouldUpdate={(prev, curr) => prev.type !== curr.type} style={{ marginBottom: 0 }}>
          {() =>
            form.getFieldValue('type') === 'period' && (
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
            )
          }
        </Form.Item>
        <ProFormSelect
          name="site"
          label="Site"
          placeholder="Please select site"
          colProps={{ span: 6 }}
          options={siteOptions.sites}
          fieldProps={{
            allowClear: true,
          }}
        />
        <Form.Item shouldUpdate={(prev, curr) => prev.type !== curr.type} style={{ marginBottom: 0 }}>
          {() =>
            form.getFieldValue('type') !== 'monthly' && (
              <ProFormSelect
                name="area"
                label="Area"
                placeholder="Please select area"
                colProps={{ span: 6 }}
                options={siteOptions.areas}
                fieldProps={{
                  allowClear: true,
                  style: { width: 200 },
                }}
              />
            )
          }
        </Form.Item>
      </ProForm>
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
