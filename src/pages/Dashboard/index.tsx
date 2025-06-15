import {
  getRescues,
  getMonthly,
  getAllSites,
  getAllAreas,
  exportCsv,
  exportHtmlFL,
} from '@/services/d2g/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProCard, ProTable } from '@ant-design/pro-components';
import { Button, message, Form, DatePicker, Select, Spin } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import scaleIcon from './assets/scale.svg';
import leafsIcon from './assets/leafs.svg';
import carIcon from './assets/car.svg';
import waterIcon from './assets/water.svg';
import treeIcon from './assets/tree.svg';
import electricityIcon from './assets/electricity.svg';
import gasIcon from './assets/gas.svg';
import UploadModal from './Components/UploadModal';
import { exportHtmlToPDF } from './pdfExport';

import styles from './index.module.less';

const { RangePicker } = DatePicker;

const filterOptions = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Period', value: 'period' },
];

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useState<any>({});
  const [siteOptions, setSiteOptions] = useState<{ label: string; value: string }[]>([]);
  const [areaOptions, setAreaOptions] = useState<{ label: string; value: string }[]>([]);

  const [cardStats, setCardStats] = useState<{
    totalFoodRescued?: number;
    co2Saved?: number;
    waterSaved?: number;
    equivTreesPlanted?: number;
    carKMOffTheRoad?: number;
    electricitySaved?: number;
    naturalGasSaved?: number;
  }>({});

  const [cardLoading, setCardLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);

  // Dynamically fetch site/area
  const fetchSites = async () => {
    const res = await getAllSites();
    console.log(res, 'sssss');
    if (res.code === 200 && Array.isArray(res.data)) {
      setSiteOptions((res.data as string[]).map((item) => ({ label: item, value: item })));
    }
  };

  const fetchAreas = async () => {
    const res = await getAllAreas();
    if (res.code === 200 && Array.isArray(res.data)) {
      setAreaOptions((res.data as string[]).map((item) => ({ label: item, value: item })));
    }
  };

  useEffect(() => {
    fetchSites();
    fetchAreas();
  }, []);

  // Dynamic columns
  const [currentType, setCurrentType] = useState('period');
  const isMonthly = currentType === 'monthly';
  console.log(isMonthly, 'isMonthly???');

  // exportHtmlFL

  const handleDownload = async (record: any) => {
    // period: id, monthly: month+site
    const key = record.month && record.site ? `${record.month}_${record.site}` : record.id;
    setDownloadingKey(key);
    try {
      const params = {
        site: record.site,
        startMonth: record.month,
      };
      const res = await exportHtmlFL(params);
      // 兼容后端返回 string 或 { data: string }
      const html = typeof res === 'string' ? res : res?.data;
      if (!html || typeof html !== 'string') {
        message.error('No report data');
        setDownloadingKey(null);
        return;
      }
      await exportHtmlToPDF(html, `Report_${record.site}_${record.month}.pdf`);
      message.success('Download successful');
    } catch (err) {
      message.error('Download failed');
    } finally {
      setDownloadingKey(null);
    }
  };
  const columnsWeekly: ProColumns[] = [
    { title: 'Date', dataIndex: 'date', valueType: 'date' },
    { title: 'Site', dataIndex: 'site', valueType: 'text' },
    { title: 'Weight', dataIndex: 'weight', valueType: 'digit' },
    { title: 'Requests', dataIndex: 'requests', valueType: 'digit' },
    {
      title: 'Fulfilled Requests',
      dataIndex: 'fulfilledRequests',
      valueType: 'digit',
    },
    { title: 'Title', dataIndex: 'title', valueType: 'text' },
    { title: 'Area', dataIndex: 'area', valueType: 'text' },
    { title: 'No. of Likes', dataIndex: 'NumberOfLikes', valueType: 'digit' },
    { title: 'Impressions', dataIndex: 'impressions', valueType: 'digit' },
    { title: 'Saved ($)', dataIndex: 'savedAmount', valueType: 'digit' },
  ];

  const columnsMonthly: ProColumns[] = [
    { title: 'Month', dataIndex: 'month', valueType: 'text' },
    { title: 'Site', dataIndex: 'site', valueType: 'text' },
    { title: 'Food Saved', dataIndex: 'foodSaved', valueType: 'text' },
    { title: 'CO2 Saved', dataIndex: 'co2Saved', valueType: 'text' },
    { title: 'Requests', dataIndex: 'requests', valueType: 'digit' },
    {
      title: 'Fulfilled Requests',
      dataIndex: 'fulfilledRequests',
      valueType: 'text',
      sorter: true,
    },
    { title: 'Families Benefitted', dataIndex: 'familiesBenefitted', valueType: 'text' },
    { title: 'No. of Likes', dataIndex: 'NumberOfLikes', valueType: 'digit' },
    { title: 'Saved ($)', dataIndex: 'savedAmount', valueType: 'digit' },
    {
      title: 'Download Report',
      dataIndex: 'download',
      render: (_: unknown, record: any) => {
        const key = `${record.month ?? ''}_${record.site ?? ''}`;
        return (
          <Button
            type="link"
            aria-label="Download Report"
            tabIndex={0}
            onClick={() => handleDownload(record)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleDownload(record);
            }}
            loading={downloadingKey === key}
          >
            Download
          </Button>
        );
      },
    },
  ];

  const columns = currentType === 'monthly' ? columnsMonthly : columnsWeekly;

  const handleExportByDaySite = async () => {
    setExportLoading(true);
    const values = form.getFieldsValue();
    const params = {
      ...values,
      startDate: values.monthRange ? values.monthRange[0].format('YYYY-MM-DD') : undefined,
      endDate: values.monthRange ? values.monthRange[1].format('YYYY-MM-DD') : undefined,
      site: Array.isArray(values.site) ? values.site.join(',') : values.site,
      area: Array.isArray(values.area) ? values.area.join(',') : values.area,
    };
    delete params.monthRange;

    try {
      const res = await exportCsv(params);
      console.log(res, 'res--export interface', typeof res);
      // 如果后端返回结构为 { data: string }
      const csvString = typeof res === 'string' ? res : res?.data;
      if (typeof csvString !== 'string' || !csvString.trim()) {
        message.error('No data to export');
        setExportLoading(false);
        return;
      }

      // 直接保存字符串为csv
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      message.success('Export successful');
    } catch (err) {
      message.error('Export failed');
    } finally {
      setExportLoading(false);
    }
  };

  const handleSearch = (values: any) => {
    setSearchLoading(true);
    console.log(form.getFieldsValue(), 'form???');
    console.log(values, 'values???');

    const params = {
      ...values,
      startDate: values.monthRange ? values.monthRange[0].format('YYYY-MM-DD') : undefined,
      endDate: values.monthRange ? values.monthRange[1].format('YYYY-MM-DD') : undefined,
      site: Array.isArray(values.site) ? values.site.join(',') : values.site,
      area: Array.isArray(values.area) ? values.area.join(',') : values.area,
    };
    delete params.monthRange;
    console.log(params, 'params???');
    setSearchParams(params);

    actionRef.current?.reload();
    setSearchLoading(false);
  };
  const handleReset = () => {
    form.resetFields();
    setCurrentType('period');
    setCardStats({});
    setSearchParams({});
  };

  // Thousands separator formatting
  const formatNumber = (val: any) => {
    if (val === null || val === undefined || val === '' || isNaN(val)) return '-';
    return Number(val).toLocaleString();
  };

  return (
    <PageContainer>
      <Form
        form={form}
        layout="inline"
        className={styles.filterForm}
        initialValues={{ type: 'period' }}
        onFinish={handleSearch}
        onReset={handleReset}
      >
        <Form.Item label="Type" name="type">
          <Select
            allowClear
            showSearch
            placeholder="Select type"
            onChange={async (val: string) => {
              setCurrentType(val);
              setCardStats({});
              // 1. 先清空 params，ProTable 立即变成空表
              setSearchParams({});
              // 2. 等下一个事件循环再设置新 params，触发新查询
              setTimeout(() => {
                setSearchParams({ type: val });
              }, 0);
              if (val !== 'monthly') {
                form.setFieldsValue({
                  startDate: undefined,
                  endDate: undefined,
                  monthRange: undefined,
                });
              }
            }}
            options={filterOptions}
            style={{ minWidth: 300, flex: 1 }}
          />
        </Form.Item>

        {currentType === 'period' && (
          <Form.Item
            label="Day"
            name="monthRange"
            rules={[{ required: true, message: 'Please select date' }]}
          >
            <RangePicker
              // picker="month"
              style={{ width: 320 }}
              placeholder={['Start Date', 'End Date']}
              allowClear={false}
              onChange={(_dates: any, dateStrings: [string, string]) => {
                console.log(_dates, '_dates', dateStrings, 'dateStrings???');
                form.setFieldsValue({
                  startDate: dateStrings[0],
                  endDate: dateStrings[1],
                });
              }}
            />
          </Form.Item>
        )}

        <Form.Item label="Site" name="site">
          <Select
            mode="multiple"
            allowClear
            showSearch
            placeholder="Please select site"
            options={siteOptions}
            style={{ minWidth: 300, flex: 1 }}
          />
        </Form.Item>

        {currentType === 'period' && (
          <Form.Item
            label="Area"
            name="area"
            rules={[{ required: true, message: 'Please select area' }]}
          >
            <Select
              mode="multiple"
              allowClear
              showSearch
              placeholder="Please select area"
              options={areaOptions}
              style={{ minWidth: 300, flex: 1 }}
            />
          </Form.Item>
        )}

        <Form.Item style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button htmlType="reset" style={{ marginRight: 8 }}>
            Reset
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: 8 }}
            loading={searchLoading}
          >
            Search
          </Button>
          {currentType === 'period' && (
            <>
              <Button
                onClick={handleExportByDaySite}
                key="exportByDaySite"
                style={{ marginRight: 8 }}
                loading={exportLoading}
              >
                EXPORT BY DAY AND AREA
              </Button>
            </>
          )}
          <UploadModal
            onUpdate={() => {
              // console.log("SAH那个穿")
              // handleSearch;
            }}
          />
        </Form.Item>
      </Form>

      <Spin spinning={cardLoading}>
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
              <img
                src={scaleIcon}
                alt="Total Food Rescued Icon"
                style={{ width: 18, height: 18 }}
              />
            </span>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
              }}
            >
              <span style={{ fontSize: 14, color: '#222', fontWeight: 500, lineHeight: 1.1 }}>
                Total Food Rescued
              </span>
              <span style={{ fontSize: 17, fontWeight: 600, marginTop: 2, letterSpacing: 0.5 }}>
                {formatNumber(cardStats.totalFoodRescued)} KG
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
              <img src={leafsIcon} alt="C02 Saved Icon" style={{ width: 18, height: 18 }} />
            </span>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
              }}
            >
              <span style={{ fontSize: 14, color: '#222', fontWeight: 500, lineHeight: 1.1 }}>
                C02 Saved
              </span>
              <span style={{ fontSize: 17, fontWeight: 600, marginTop: 2, letterSpacing: 0.5 }}>
                {formatNumber(cardStats.co2Saved)} kg
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
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
              }}
            >
              <span style={{ fontSize: 14, color: '#222', fontWeight: 500, lineHeight: 1.1 }}>
                Water Saved
              </span>
              <span style={{ fontSize: 17, fontWeight: 600, marginTop: 2, letterSpacing: 0.5 }}>
                {formatNumber(cardStats.waterSaved)} litres
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
                src={treeIcon}
                alt="Equiv Trees Planted Icon"
                style={{ width: 18, height: 18 }}
              />
            </span>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
              }}
            >
              <span style={{ fontSize: 14, color: '#222', fontWeight: 500, lineHeight: 1.1 }}>
                Equiv Trees Planted
              </span>
              <span style={{ fontSize: 17, fontWeight: 600, marginTop: 2, letterSpacing: 0.5 }}>
                {formatNumber(cardStats.equivTreesPlanted)}
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
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
              }}
            >
              <span style={{ fontSize: 14, color: '#222', fontWeight: 500, lineHeight: 1.1 }}>
                Car KM Off The Road
              </span>
              <span style={{ fontSize: 17, fontWeight: 600, marginTop: 2, letterSpacing: 0.5 }}>
                {formatNumber(cardStats.carKMOffTheRoad)}
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
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
              }}
            >
              <span style={{ fontSize: 14, color: '#222', fontWeight: 500, lineHeight: 1.1 }}>
                Electricity Saved
              </span>
              <span style={{ fontSize: 17, fontWeight: 600, marginTop: 2, letterSpacing: 0.5 }}>
                {formatNumber(cardStats.electricitySaved)} kg
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
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
              }}
            >
              <span style={{ fontSize: 14, color: '#222', fontWeight: 500, lineHeight: 1.1 }}>
                Natural Gas Saved
              </span>
              <span style={{ fontSize: 17, fontWeight: 600, marginTop: 2, letterSpacing: 0.5 }}>
                {formatNumber(cardStats.naturalGasSaved)} litres
              </span>
            </div>
          </ProCard>
        </ProCard>
      </Spin>

      <ProTable<API.RuleListItem, any>
        actionRef={actionRef}
        rowKey="id"
        // rowKey={currentType === 'monthly' ? (record: any) => `${record.month ?? ''}_${record.site ?? ''}` : 'id'}
        search={false}
        options={false}
        toolBarRender={false}
        params={searchParams}
        pagination={{
          defaultPageSize: 50,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        request={async (params) => {
          setCardLoading(true);
          setSearchLoading(true);

          let apiRes;
          if (params.type === 'monthly') {
            apiRes = await getMonthly({
              ...params,
              page: params.current,
              pageSize: params.pageSize,
            });
          } else {
            apiRes = await getRescues({
              ...params,
              page: params.current,
              pageSize: params.pageSize,
            });
          }
          delete params.current;

          setCardLoading(false);
          setSearchLoading(false);

          console.log(apiRes, 'apiRes');
          if (apiRes.code === 200 && apiRes.data && apiRes.data.page) {
            setCardStats({
              totalFoodRescued: apiRes.data.totalFoodRescued,
              co2Saved: apiRes.data.co2Saved,
              waterSaved: apiRes.data.waterSaved,
              equivTreesPlanted: apiRes.data.equivTreesPlanted,
              carKMOffTheRoad: apiRes.data.carKMOffTheRoad,
              electricitySaved: apiRes.data.electricitySaved,
              naturalGasSaved: apiRes.data.naturalGasSaved,
            });
            return {
              data: apiRes.data.page.content,
              success: true,
              total: apiRes.data.page.totalElements,
            };
          }
          return { data: [], success: true, total: 0 };
        }}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
