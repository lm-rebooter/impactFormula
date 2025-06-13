import React from 'react';
import { Button, Modal, message, Upload, Spin } from 'antd';
import Cookies from 'js-cookie';
import { uploadFileWuliuExcel } from '@/services/d2g/api';
import styles from '../index.module.less';
const UploadModal = ({ onUpdate }) => {
  let RefModal = null;

  const uploadProps = {
    name: 'file',
    action: uploadFileWuliuExcel,
    accept: '.xls,.xlsx,.excel,.csv', // Allowed file formats
    showUploadList: false,
    headers: {
      Authorization: decodeURIComponent(`Bearer ${Cookies.get('token')}`),
    },
    onRemove: () => {},
    beforeUpload: () => {
      RefModal = Modal.info({
        title: 'Batch import in progress. Please do not close the pop-up window...',
        content: (
          <div style={{ paddingTop: 20 }}>
            <Spin />
          </div>
        ),
      });
    },
    onChange: ({ file }) => {
      console.log(file, 'file');
      if (file.status === 'done' && file.response.code === 200) {
        RefModal.destroy();
        RefModal = null;
        onUpdate();
        message.success(`${file.response.message}`);
      } else if (
        file.status === 'error' ||
        (file.status === 'done' && file?.response?.code !== 200)
      ) {
        message.error(`${file?.response?.message}`);
        RefModal.destroy();
        RefModal = null;
      }
    },
  };

  const Btn = () => {
    return (
      <span className={styles.uploadBtnContainer}>
        <Upload {...uploadProps}>
          <Button className={styles.uploadBtn}>
            <icon type="upload" /> IMPORT
          </Button>
        </Upload>
      </span>
    );
  };

  return <Btn />;
};
export default UploadModal;
