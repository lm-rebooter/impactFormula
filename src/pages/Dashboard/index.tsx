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
import { Button, Drawer, Input, message, Form, DatePicker, Space } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';

const { RangePicker } = DatePicker;

/**
 * Add node
 * @param fields
 */
const handleAdd = async (fields: API.RuleListItem) => {
  const hide = message.loading('Adding...');
  try {
    await addRule({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

/**
 * Update node
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring...');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

/**
 * Delete node
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.RuleListItem[]) => {
  const hide = message.loading('Deleting...');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const TableList: React.FC = () => {
  /**
   * Pop-up window of new window
   */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * The pop-up window of the distribution update window
   */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();

  // International configuration

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
     
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
