import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ResumePreview from './components/resume/ResumePreview';
import ErrorBoundary from './components/resume/ErrorBoundary';
import './PublishResumeView.css';

const PublishResumeView = () => {
  const { id } = useParams();
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSnapshot() {
      try {
        const res = await fetch(`/api/publish?userId=${id}`);
        const data = await res.json();
        if (data && data.snapshot) {
          setSnapshot(data.snapshot);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchSnapshot();
  }, [id]);

  if (loading) return <div className="publish-view-wrapper">加载中...</div>;
  if (!snapshot) return <div className="publish-view-wrapper">未找到发布记录</div>;

  return (
    <div className="publish-view-wrapper">
      <ErrorBoundary>
        <ResumePreview snapshot={snapshot} isPublishMode />
      </ErrorBoundary>
    </div>
  );
};

export default PublishResumeView;
