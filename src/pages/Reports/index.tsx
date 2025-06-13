import React, { useState, useEffect } from 'react';
import { Button, Form, Select, Spin, Empty, DatePicker } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import styles from './index.module.less';
import { getAllSites, getAllAreas, exportHtmlFL } from '@/services/d2g/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
const { RangePicker } = DatePicker;

const ReportsPage: React.FC = () => {
  const [siteOptions, setSiteOptions] = useState<{ label: string; value: string }[]>([]);
  const [areaOptions, setAreaOptions] = useState<{ label: string; value: string }[]>([]);
  const [site, setSite] = useState<string[]>([]);
  const [area, setArea] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [reportHtml, setReportHtml] = useState<string>('');
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Fetch site/area options
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
      setShowPDF(true);
      setLoading(false);
    }, 800);
  }, []);

  const handleSearch = (values: any) => {
    // Convert site/area to string, format month range
    let startMonth = '';
    let endMonth = '';
    if (values.monthRange && values.monthRange.length === 2) {
      startMonth = values.monthRange[0]?.format('YYYY-MM');
      endMonth = values.monthRange[1]?.format('YYYY-MM');
    }
    const params = {
      site: Array.isArray(values.site) ? values.site.join(',') : values.site,
      area: Array.isArray(values.area) ? values.area.join(',') : values.area,
      startMonth,
      endMonth,
    };
    setLoading(true);
    setShowPDF(false);
    exportHtmlFL(params).then((res) => {
      // If API returns HTML string, set it directly. If it returns an object, extract the HTML string.
      if (typeof res === 'string') {
        setReportHtml(res);
      } else if (res && typeof res.data === 'string') {
        setReportHtml(res.data);
      } else {
        setReportHtml('');
      }
    });
    setTimeout(() => {
      setShowPDF(true);
      setLoading(false);
    }, 800);
  };

  const handleReset = () => {
    form.resetFields();
    setSite([]);
    setArea([]);
    setShowPDF(false);
    setLoading(false);
  };

  // PDF export using hidden iframe and html2canvas
  const handleDownloadPDF = async () => {
    setDownloadLoading(true);
    if (!reportHtml) {
      setDownloadLoading(false);
      return;
    }
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-9999px';
    iframe.style.top = '0';
    iframe.style.width = '1200px';
    iframe.style.height = '1100px';
    document.body.appendChild(iframe);
    if (iframe.contentDocument) {
      iframe.contentDocument.open();
      iframe.contentDocument.write(reportHtml);
      iframe.contentDocument.close();
    }
    iframe.onload = () => {
      setTimeout(async () => {
        const target = iframe.contentDocument?.body;
        if (target) {
          const originalWidth = target.style.width;
          const exportWidth = 1200;
          target.style.width = exportWidth + 'px';
          target.style.minWidth = exportWidth + 'px';
          target.style.maxWidth = exportWidth + 'px';
          const canvas = await html2canvas(target, {
            useCORS: true,
            backgroundColor: '#fff',
            scale: 2,
          });
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'pt', [canvas.width, canvas.height]);
          pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
          pdf.save('ImpactReport.pdf');
          target.style.width = originalWidth;
          target.style.minWidth = '';
          target.style.maxWidth = '';
        }
        document.body.removeChild(iframe);
        setDownloadLoading(false);
      }, 2000);
    };
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
        <Form.Item
          label="Month Range"
          name="monthRange"
          style={{ marginRight: 16 }}
          rules={[{ required: true, message: 'Please select month range' }]}
        >
          <RangePicker
            picker="month"
            format="YYYY-MM"
            allowClear
            style={{ minWidth: 260 }}
            placeholder={['Start Month', 'End Month']}
          />
        </Form.Item>
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
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }} loading={loading}>
            Search
          </Button>
        </Form.Item>
      </Form>
      {/* PDF Preview Area */}
      <div className={styles.pdfPreview} style={{ position: 'relative' }}>
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
        {!loading && showPDF && reportHtml && (
          <>
            <Button
              type="primary"
              onClick={handleDownloadPDF}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 10,
              }}
              loading={downloadLoading}
            >
              Download PDF
            </Button>
            <iframe
              srcDoc={reportHtml}
              width="100%"
              height="700"
              title="Report Preview"
              style={{ border: 0, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            />
          </>
        )}
        {!loading && showPDF && !reportHtml && (
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
