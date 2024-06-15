import { Button, Input, Modal, Typography, message } from 'antd';
import { useState } from 'react';

const CreateList = ({
  open,
  onClose,
  createList,
}: {
  open: boolean;
  onClose: () => void;
  createList: (name: string, desc: string) => void;
}) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const createListLocal = () => {
    if (name.trim().length === 0) {
      message.warning('Please enter a name');
      return;
    }
    setName('');
    setDesc('');
    createList(name, desc);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      centered
      closable
      footer={null}
      width={500}
    >
      <div style={{ display: 'grid', gap: '1em' }}>
        <div>
          <Typography.Title level={4}>Create List</Typography.Title>
        </div>
        <div>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name for the list"
          />
        </div>
        <div>
          <Input.TextArea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Enter desc for the list (optional)"
          />
        </div>
        <div style={{ display: 'flex', gap: '1em' }}>
          <Button onClick={createListLocal} type="primary">
            Create
          </Button>
          <Button onClick={onClose} type="text" danger>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateList;
