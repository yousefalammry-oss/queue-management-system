import React, { useEffect, useState } from 'react';

export default function QuickJoin() {
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // التحقق هل لدى العميل تذكرة محفوظة مسبقاً في الذاكرة المحلية للجوال
    const savedTicket = localStorage.getItem('user_active_ticket');
    if (savedTicket) {
      setTicket(JSON.parse(savedTicket));
      setLoading(false);
      return;
    }

    // إرسال طلب الحجز الفوري تلقائياً للسيرفر الحي على Render
    fetch('https://queue-management-system-lhhp.onrender.com/tickets/quick-join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ branchId: 'main' }), // استبدل 'main' بمعرف الفرع الفعلي لديك إذا لزم
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTicket(data.data);
          localStorage.setItem('user_active_ticket', JSON.stringify(data.data));
        } else {
          setError('فشل إصدار التذكرة الفورية.');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('حدث خطأ في الاتصال بالخادم.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Cairo, sans-serif' }}>
        <h2>⏳ جاري إصدار تذكرتك الرقمية الفورية...</h2>
      </div>
    );
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: '100px', fontFamily: 'Cairo, sans-serif' }}>{error}</div>;
  }

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', padding: '24px', textAlign: 'center', fontFamily: 'Cairo, sans-serif', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      <h2>🎫 تذكرتك الرقمية (بيجر ذكي)</h2>
      <div style={{ fontSize: '52px', fontWeight: 'bold', color: '#2563eb', margin: '20px 0' }}>
        {ticket?.code}
      </div>
      <p style={{ fontSize: '18px', color: '#374151' }}>حالة الطلب: <strong>{ticket?.status === 'WAITING' ? 'في الانتظار ⏳' : 'حانت نوبتك! 🔔'}</strong></p>
      <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '15px' }}>ابق هذه الصفحة مفتوحة، سيصلك تنبيه النداء فوراً عند استدعائك من قِبل الموظف.</p>
    </div>
  );
}
