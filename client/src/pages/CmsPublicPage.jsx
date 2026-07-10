import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Seo from '../components/common/Seo';
import Markdown from '../components/common/Markdown';
import api from '../lib/api';

// Public render of an admin-managed CMS page (GET /pages/:slug — PUBLISHED
// only). Used for /terms, /privacy and the generic /pages/:slug route; the
// admin edits these under Admin → Site pages.
export default function CmsPublicPage({ slug: slugProp }) {
  const params = useParams();
  const navigate = useNavigate();
  const slug = slugProp || params.slug;
  const [page, setPage] = useState(undefined); // undefined=loading, null=not found

  useEffect(() => {
    window.scrollTo(0, 0);
    setPage(undefined);
    api.publicPage(slug).then(setPage).catch(() => setPage(null));
  }, [slug]);

  if (page === undefined) {
    return (
      <div className="mx-auto max-w-[820px] px-4 py-12 sm:px-6">
        <div className="skeleton mb-5 h-9 w-72 rounded" />
        <div className="skeleton mb-3 h-4 w-full rounded" />
        <div className="skeleton mb-3 h-4 w-5/6 rounded" />
        <div className="skeleton h-40 w-full rounded" />
      </div>
    );
  }

  if (page === null) {
    return (
      <div className="mx-auto max-w-container px-6 py-20 text-center text-ink-mute">
        This page isn’t available. <button onClick={() => navigate('/')} className="text-brand underline">Go home</button>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F5] pb-14 pt-8">
      <Seo title={page.title} description={`${page.title} — OBS Events`} />
      <div className="mx-auto max-w-[820px] px-4 sm:px-6">
        <article className="rounded-xl border border-line bg-white p-6 shadow-card sm:p-10">
          <h1 className="text-2xl font-black text-ink sm:text-3xl">{page.title}</h1>
          {page.updatedAt && (
            <div className="mt-1.5 border-b border-line pb-4 text-[12px] text-ink-mute">
              Last updated {new Date(page.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          )}
          <div className="mt-4">
            <Markdown content={page.content} />
          </div>
        </article>
      </div>
    </div>
  );
}
