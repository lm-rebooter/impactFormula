import React, { useState } from 'react';
import { Button, Form, Input, Modal, Spin } from 'antd';
import { formula } from '@/services/d2g/api';
import { formatNumber } from '../../utils/format';

import { PageContainer, ProCard } from '@ant-design/pro-components';
import styles from './index.module.less';
import leafsIcon from './assets/leafs.svg';
import carIcon from './assets/car.svg';
import waterIcon from './assets/water.svg';
import treeIcon from './assets/tree.svg';
import electricityIcon from './assets/electricity.svg';
import gasIcon from './assets/gas.svg';

const ImpactFormula: React.FC = () => {
  // Card data state
  const [cardStats, setCardStats] = useState<{
    co2Saved?: number;
    waterSaved?: number;
    equivTreesPlanted?: number;
    carKMOffTheRoad?: number;
    electricitySaved?: number;
    naturalGasSaved?: number;
  }>({});
  const [loading, setLoading] = useState(false);
  const [showCalculationModal, setShowCalculationModal] = useState(false);
  const [form] = Form.useForm();

  // Call formula API on search
  const handleSearch = async (values: any) => {
    setLoading(true);
    try {
      const res = (await formula({ weight: values.weight })) as {
        success: boolean;
        data?: {
          c02Saved?: number;
          waterSaved?: number;
          equivTreesPlanted?: number;
          carKMOffTheRoad?: number;
          electricitySaved?: number;
          naturalGasSaved?: number;
        };
      };

      if (res && res.code === 200 && res.data) {
        setCardStats({
          co2Saved: res.data.c02Saved,
          waterSaved: res.data.waterSaved,
          equivTreesPlanted: res.data.equivTreesPlanted,
          carKMOffTheRoad: res.data.carKMOffTheRoad,
          electricitySaved: res.data.electricitySaved,
          naturalGasSaved: res.data.naturalGasSaved,
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const handleReset = () => {
    form.resetFields();
    setCardStats({
      co2Saved: undefined,
      waterSaved: undefined,
      equivTreesPlanted: undefined,
      carKMOffTheRoad: undefined,
      electricitySaved: undefined,
      naturalGasSaved: undefined,
    });
  };

  return (
    <PageContainer>
      <Form
        form={form}
        layout="inline"
        className={styles.filterForm}
        initialValues={{ weight: 1000 }}
        onFinish={handleSearch}
        onReset={handleReset}
      >
        <Form.Item
          label="Weight"
          name="weight"
          rules={[
            {
              required: true,
              message: 'Please input weight',
            },
          ]}
        >
          <Input
            type="number"
            min={0}
            suffix="kg"
            placeholder="Enter weight"
            style={{ width: 160, marginRight: 8 }}
          />
        </Form.Item>
        <Form.Item>
          <Button htmlType="reset" style={{ marginRight: 8 }}>
            Reset
          </Button>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }} loading={loading}>
            Search
          </Button>
          <Button
            type="primary"
            tabIndex={0}
            aria-label="View Calculation Method"
            onClick={() => setShowCalculationModal(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setShowCalculationModal(true);
              }
            }}
          >
            View Calculation Method
          </Button>
        </Form.Item>
      </Form>

      <Modal
        open={showCalculationModal}
        onCancel={() => setShowCalculationModal(false)}
        footer={null}
        width={800}
        bodyStyle={{ padding: 0 }}
        title="How We Calculated It"
        destroyOnClose
      >
        <div
          style={{
            width: '100%',
            minHeight: 550,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f5',
          }}
        >
          <iframe
            src="/How We Calculated It.pdf"
            title="How We Calculated It PDF"
            width="100%"
            height="550px"
            style={{
              border: 0,
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          />
        </div>
      </Modal>

      <Spin spinning={loading}>
        <ProCard
          gutter={[{ xs: 8, sm: 8, md: 16, lg: 24, xl: 32 }, 16]}
          style={{ marginBlockStart: 16 }}
        >
          <ProCard bordered>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 120,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#e6f4f1',
                    marginRight: 16,
                  }}
                >
                  <img src={leafsIcon} alt="CO2 Icon" style={{ width: 24, height: 24 }} />
                </span>
                <span style={{ fontSize: 20, fontWeight: 500 }}>C02 Saved</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 500 }}>
                {formatNumber(cardStats.co2Saved)} kg
              </div>
            </div>
          </ProCard>
          <ProCard bordered title={null}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 120,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#e6f4f1',
                    marginRight: 16,
                  }}
                >
                  <img src={waterIcon} alt="Water Icon" style={{ width: 24, height: 24 }} />
                </span>
                <span style={{ fontSize: 20, fontWeight: 500 }}>Water Saved</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 500 }}>
                {formatNumber(cardStats.waterSaved)} litres
              </div>
            </div>
          </ProCard>
          <ProCard bordered title={null}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 120,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#e6f4f1',
                    marginRight: 16,
                  }}
                >
                  <img src={treeIcon} alt="Tree Icon" style={{ width: 24, height: 24 }} />
                </span>
                <span style={{ fontSize: 20, fontWeight: 500 }}>Equiv Trees Planted</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 500 }}>
                {formatNumber(cardStats.equivTreesPlanted)}
              </div>
            </div>
          </ProCard>
        </ProCard>

        <ProCard
          gutter={[{ xs: 8, sm: 8, md: 16, lg: 24, xl: 32 }, 16]}
          style={{ marginBlockStart: 16 }}
        >
          <ProCard bordered>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 120,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#e6f4f1',
                    marginRight: 16,
                  }}
                >
                  <img src={carIcon} alt="Car Icon" style={{ width: 24, height: 24 }} />
                </span>
                <span style={{ fontSize: 20, fontWeight: 500 }}>Car KM Off The Road</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 500 }}>
                {formatNumber(cardStats.carKMOffTheRoad)}
              </div>
            </div>
          </ProCard>
          <ProCard bordered>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 120,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#e6f4f1',
                    marginRight: 16,
                  }}
                >
                  <img
                    src={electricityIcon}
                    alt="Electricity Icon"
                    style={{ width: 24, height: 24 }}
                  />
                </span>
                <span style={{ fontSize: 20, fontWeight: 500 }}>Electricity Saved</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 500 }}>
                {formatNumber(cardStats.electricitySaved)} kg
              </div>
            </div>
          </ProCard>
          <ProCard bordered>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 120,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#e6f4f1',
                    marginRight: 16,
                  }}
                >
                  <img src={gasIcon} alt="Gas Icon" style={{ width: 24, height: 24 }} />
                </span>
                <span style={{ fontSize: 20, fontWeight: 500 }}>Natural Gas Saved</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 500 }}>
                {formatNumber(cardStats.naturalGasSaved)} litres
              </div>
            </div>
          </ProCard>
        </ProCard>
      </Spin>
    </PageContainer>
  );
};

export default ImpactFormula;
