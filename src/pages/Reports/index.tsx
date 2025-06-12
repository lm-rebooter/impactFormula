import React, { useState, useEffect } from 'react';
import { Button, Form, Select, Spin, Empty } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import styles from './index.module.less';
import { getAllSites, getAllAreas } from '@/services/ant-design-pro/api';

const ReportsPage: React.FC = () => {
  const [siteOptions, setSiteOptions] = useState<{ label: string; value: string }[]>([]);
  const [areaOptions, setAreaOptions] = useState<{ label: string; value: string }[]>([]);
  const [site, setSite] = useState<string[]>([]);
  const [area, setArea] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [form] = Form.useForm();

  useEffect(() => {
    // 获取 site/area options
    getAllSites().then((res) => {
      if (res.code === 200 && Array.isArray(res.data)) {
        setSiteOptions((res.data as string[]).map((item) => ({ label: item, value: item })));
      }
    });
    getAllAreas().then((res) => {
      if (res.code === 200 && Array.isArray(res.data)) {
        setAreaOptions((res.data as string[]).map((item) => ({ label: item, value: item })));
      }
    });
    setLoading(true);
    setShowPDF(false);
    setTimeout(() => {
      setPdfUrl(''); // 默认无数据
      setShowPDF(true);
      setLoading(false);
    }, 800);
  }, []);

  const handleSearch = (values: any) => {
    // site/area 多选转字符串
    const params = {
      site: Array.isArray(values.site) ? values.site.join(',') : values.site,
      area: Array.isArray(values.area) ? values.area.join(',') : values.area,
    };
    console.log('Search parameters:', params);
    setLoading(true);
    setShowPDF(false);
    setTimeout(() => {
      setPdfUrl('https://static.taoche.com/taochecheicp.pdf');
      setShowPDF(true);
      setLoading(false);
    }, 800);
  };
  const handleReset = () => {
    form.resetFields();
    setSite([]);
    setArea([]);
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
        initialValues={{ site, area }}
        onFinish={handleSearch}
        onReset={handleReset}
      >
        <Form.Item label="Site" name="site">
          <Select
            mode="multiple"
            allowClear
            showSearch
            placeholder="Please select site"
            value={site}
            onChange={(v) => setSite(v)}
            options={siteOptions}
            style={{ minWidth: 300, flex: 1 }}
          />
        </Form.Item>
        <Form.Item label="Area" name="area">
          <Select
            mode="multiple"
            allowClear
            showSearch
            placeholder="Please select area"
            value={area}
            onChange={(v) => setArea(v)}
            options={areaOptions}
            style={{ minWidth: 300, flex: 1 }}
          />
        </Form.Item>
        <Form.Item>
          <Button htmlType="reset" style={{ marginRight: 8 }}>
            Reset
          </Button>
          <Button type="primary" htmlType="submit">
            Search
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
