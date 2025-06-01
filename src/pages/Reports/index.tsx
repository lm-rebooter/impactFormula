import React, { useState, useRef, useEffect } from 'react';
import { Button, message, Form, Select, Spin, DatePicker, Space, Empty } from 'antd';
import { addRule, removeRule, rule, updateRule } from '@/services/ant-design-pro/api';

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
import styles from './index.module.less';

const filterOptions = [
  { label: 'ABC', value: 'ABC' },
  { label: 'AAA', value: 'AAA' },
  { label: 'adhoc', value: 'adhoc' },
  { label: 'Adhoc', value: 'Adhoc' },
  { label: 'ADHOC', value: 'ADHOC' },
  { label: 'Adhoc - chocolate egg candy', value: 'Adhoc - chocolate egg candy' },
  { label: 'Adhoc-Juice BCC', value: 'Adhoc-Juice BCC' },
  { label: 'AK', value: 'AK' },
  { label: 'AK1', value: 'AK1' },
  { label: 'AR', value: 'AR' },
  { label: 'BA', value: 'BA' },
  { label: 'BB', value: 'BB' },
  { label: 'BC1', value: 'BC1' },
  { label: 'BCS', value: 'BCS' },
  { label: 'BD', value: 'BD' },
  { label: 'BE', value: 'BE' },
  { label: 'BG1', value: 'BG1' },
  { label: 'BL', value: 'BL' },
  { label: 'BN', value: 'BN' },
  { label: 'BN1', value: 'BN1' },
  { label: 'BR', value: 'BR' },
  { label: 'CA', value: 'CA' },
  { label: 'CC', value: 'CC' },
  { label: 'CCP', value: 'CCP' },
  { label: 'CDL1', value: 'CDL1' },
  { label: 'CDL10', value: 'CDL10' },
  { label: 'CDL11', value: 'CDL11' },
  { label: 'CDL12', value: 'CDL12' },
  { label: 'CDL13', value: 'CDL13' },
  { label: 'CDL14', value: 'CDL14' },
  { label: 'CDL15', value: 'CDL15' },
];

const ReportsPage: React.FC = () => {
  const [month, setMonth] = useState();
  const [filters, setFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [form] = Form.useForm();

  useEffect(() => {
    setLoading(true);
    setShowPDF(false);
    setTimeout(() => {
      // setPdfUrl('https://static.taoche.com/taochecheicp.pdf'); // when there is data
      setPdfUrl(''); // when there is no data
      setShowPDF(true);
      setLoading(false);
    }, 800);
  }, []);

  const handleQuery = (values: any) => {
    console.log('Query parameters:', values);
    setLoading(true);
    setShowPDF(false);
    setTimeout(() => {
      setPdfUrl('https://static.taoche.com/taochecheicp.pdf');
      setShowPDF(true);
      setLoading(false);
    }, 800);
  };
  const handleReset = () => {
    // Reset form fields
    form.resetFields();
    // Reset local state
    setMonth(undefined);
    setFilters([]);
    setPdfUrl('');
    setShowPDF(false);
    setLoading(false);
  };
  return (
    <PageContainer>
      <Form
        form={form}
        layout="inline"
        className={styles.filterForm}
        initialValues={{ month, filters }}
        onFinish={handleQuery}
        onReset={handleReset}
      >
        <Form.Item label="Report Period" name="month">
          <DatePicker
            picker="month"
            value={month}
            onChange={(v) => setMonth(v)}
            allowClear={false}
            style={{ width: 128 }}
          />
        </Form.Item>
        <Form.Item label="Filter by" name="filters">
          <Select
            mode="multiple"
            allowClear
            showSearch
            placeholder="Select filters"
            value={filters}
            onChange={(v) => setFilters(v)}
            options={filterOptions}
            style={{ minWidth: 300, flex: 1 }}
          />
        </Form.Item>
        <Form.Item>
          <Button htmlType="reset" style={{ marginRight: 8 }}>
            Reset
          </Button>
          <Button type="primary" htmlType="submit">
            Query
          </Button>
        </Form.Item>
      </Form>
      {/* PDF Preview Area */}
      <div className={styles.pdfPreview}>
        {loading && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              height: 550,
              justifyContent: 'center',
            }}
          >
            <Spin size="large" />
            <span style={{ marginTop: 16, color: '#6b7280' }}>Loading report...</span>
          </div>
        )}
        {!loading && showPDF && pdfUrl && (
          <iframe
            src={pdfUrl}
            width="100%"
            height="550px"
            title="PDF Preview"
            style={{ border: 0, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          ></iframe>
        )}
        {!loading && showPDF && !pdfUrl && (
          <div
            style={{
              width: '100%',
              minHeight: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fff',
              borderRadius: 6,
            }}
          >
            <Empty description="No report data" />
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default ReportsPage;
