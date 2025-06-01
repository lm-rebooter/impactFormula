module.exports = {
  'GET /api/currentUser': {
    data: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      email: 'antdesign@alipay.com',
      signature: '海纳百川，有容乃大',
      title: '交互专家',
      group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
      tags: [
        { key: '0', label: '很有想法的' },
        { key: '1', label: '专注设计' },
        { key: '2', label: '辣~' },
        { key: '3', label: '大长腿' },
        { key: '4', label: '川妹子' },
        { key: '5', label: '海纳百川' },
      ],
      notifyCount: 12,
      unreadCount: 11,
      country: 'China',
      geographic: {
        province: { label: '浙江省', key: '330000' },
        city: { label: '杭州市', key: '330100' },
      },
      address: '西湖区工专路 77 号',
      phone: '0752-268888888',
    },
  },
  'GET /api/rule': (req, res) => {
    const { current = 1, pageSize = 10 } = req.query;
    const allData = Array.from({ length: 57 }).map((_, i) => ({
      key: i + 1,
      date: `2024-06-${String((i % 30) + 1).padStart(2, '0')}`,
      month: '2024-06',
      site: `Site ${String.fromCharCode(65 + (i % 10))}`,
      weight: 100 + (i % 100),
      requests: 1000 + i * 10,
      fulfilledRequests: 900 + i * 5,
      title: `Title ${String.fromCharCode(65 + (i % 10))}`,
      area: `Area ${(i % 10) + 1}`,
      links: (i % 10) + 1,
      impressions: 2000 + i * 20,
      saved: i % 2 === 0 ? 100 + i : undefined,
      foodSaved: i % 2 === 0 ? `Food ${i}` : undefined,
      co2Saved: i % 2 === 0 ? `CO2 ${i}` : undefined,
      familiesBenefitted: i % 2 === 0 ? `Family ${i}` : undefined,
    }));
    const start = (current - 1) * pageSize;
    const end = start + Number(pageSize);
    const pageData = allData.slice(start, end);
    res.json({
      data: pageData,
      total: allData.length,
    success: true,
      pageSize: Number(pageSize),
      current: Number(current),
    });
  },
  'POST /api/login/outLogin': { data: {}, success: true },
  'POST /api/login/account': {
    status: 'ok',
    type: 'account',
    currentAuthority: 'admin',
  },
};
