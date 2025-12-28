import React, { useEffect } from 'react';
import { urlFor } from '../services/sanityClient';
import { SanityImageAsset, SanityAmbassador } from '../types';
import {
    ArrowLeft,
    Sparkles,
    Calendar,
    Clock,
    MapPin,
    Instagram,
    Globe,
    Phone,
    CheckCircle2,
    Share2,
    ExternalLink
} from 'lucide-react';

export interface DetailContentSection {
    heading?: string;
    body: string;
}

export interface DetailViewData {
    title: string;
    category: string;
    heroImage: SanityImageAsset;
    content?: DetailContentSection[];
    author?: {
        name: string;
        title: string;
        image?: SanityImageAsset;
        bio?: string;
    };
    date?: string;
    readingTime?: string;
    tags?: string[];
    takeaway?: string;
    // Specific to List Items
    rank?: number;
    location?: {
        address?: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    gallery?: SanityImageAsset[];
    features?: string[];
    contactInfo?: {
        website?: string;
        instagram?: string;
        phone?: string;
    };
}

interface DetailViewProps {
    data: DetailViewData;
    onBack: () => void;
    language: 'en' | 'mn';
}

export const DetailView: React.FC<DetailViewProps> = ({ data, onBack, language }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const googleMapsUrl = data.location?.coordinates
        ? `https://www.google.com/maps/search/?api=1&query=${data.location.coordinates.lat},${data.location.coordinates.lng}`
        : data.location?.address
            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.location.address)}`
            : null;

    return (
        <div className="bg-slate-100 min-h-screen">
            {/* Hero Header */}
            <div className="relative h-[70vh] min-h-[600px] w-full overflow-hidden">
                <img
                    src={urlFor(data.heroImage).width(1600).height(900).url()}
                    alt={data.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                {/* Navigation Bar */}
                <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-20">
                    <button
                        onClick={onBack}
                        className="group flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-none hover:bg-white hover:text-slate-900 transition-all duration-300 font-bold uppercase tracking-widest text-[10px]"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        {language === 'mn' ? 'Nazad' : 'Back'}
                    </button>

                    <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-none hover:bg-white hover:text-slate-900 transition-all duration-300">
                        <Share2 size={18} />
                    </button>
                </div>

                {/* Hero Content */}
                <div className="absolute bottom-0 inset-x-0 p-8 md:p-16 z-10 text-white">
                    <div className="max-w-5xl mx-auto space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                            {data.rank && (
                                <span className="bg-montenegro-red text-white w-12 h-12 flex items-center justify-center font-display font-bold text-2xl rounded-sm">
                                    {data.rank}
                                </span>
                            )}
                            <div className="px-5 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-none text-[10px] font-black uppercase tracking-[0.3em]">
                                {data.category}
                            </div>
                            {data.readingTime && (
                                <div className="flex items-center gap-2 text-xs font-medium text-white/80">
                                    <Clock size={14} /> {data.readingTime}
                                </div>
                            )}
                        </div>
                        <h1 className="text-5xl md:text-8xl font-display font-bold leading-[0.9] tracking-tight">
                            {data.title}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 pt-16 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16 md:gap-24 items-start">

                    {/* Main Content Side */}
                    <div className="space-y-16">
                        {/* Meta & Location Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-12 border-b-2 border-slate-100">
                            {data.author && (
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-none overflow-hidden bg-slate-100 border border-slate-200">
                                        {data.author.image ? (
                                            <img src={urlFor(data.author.image).width(100).url()} alt={data.author.name} className="w-full h-full object-cover grayscale-[0.2]" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold bg-slate-200">
                                                {data.author.name[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-black text-slate-900 uppercase tracking-wide">{data.author.name}</p>
                                        <p className="text-xs text-slate-500 font-medium">{data.author.title}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-8 items-center">
                                {data.date && (
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Published</p>
                                        <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                            {new Date(data.date).toLocaleDateString(language === 'mn' ? 'sr-ME' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>
                                )}

                                {data.location?.address && (
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</p>
                                        <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                            <MapPin size={16} className="text-montenegro-red" />
                                            {data.location.address}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Articles/Content */}
                        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-display prose-headings:font-bold prose-p:leading-relaxed prose-p:text-slate-600">
                            {data.content?.map((section, idx) => (
                                <section key={`section-${idx}-${section.heading || 'content'}`} className="mb-16">
                                    {section.heading && (
                                        <h2 className="text-3xl md:text-4xl text-slate-900 mb-8 border-l-4 border-montenegro-red pl-6">
                                            {section.heading}
                                        </h2>
                                    )}
                                    <p className="">
                                        {section.body}
                                    </p>
                                </section>
                            ))}
                        </div>

                        {/* Key Takeaway / Insider Tip */}
                        {data.takeaway && (
                            <div className="relative py-12 px-8 border-y-2 border-slate-900 overflow-hidden">
                                <p className="text-xs font-black uppercase tracking-[0.4em] text-montenegro-red mb-6 flex items-center gap-2">
                                    <Sparkles size={16} /> {language === 'mn' ? 'Lokalni Savjet' : 'Local Insider Tip'}
                                </p>
                                <p className="text-2xl md:text-3xl font-bold leading-snug text-slate-900 relative z-10 font-display">
                                    "{data.takeaway}"
                                </p>
                            </div>
                        )}

                        {/* Gallery Section */}
                        {data.gallery && data.gallery.length > 0 && (
                            <section className="space-y-10">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
                                        {language === 'mn' ? 'Foto Galerija' : 'Visual Story'}
                                    </h3>
                                    <div className="h-px flex-1 bg-slate-100"></div>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                    {data.gallery.map((img, idx) => (
                                        <div
                                            key={`gallery-img-${idx}`}
                                            className={`relative overflow-hidden group cursor-zoom-in ${idx === 0 ? 'col-span-2 row-span-2 aspect-[4/5] lg:aspect-square' : 'aspect-square'
                                                }`}
                                        >
                                            <img
                                                src={urlFor(img).width(1000).url()}
                                                className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                                                alt={`${data.title} gallery ${idx}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar - Clean & Integrated */}
                    <aside className="sticky top-24 space-y-12">
                        {/* Action List */}
                        {(data.contactInfo || googleMapsUrl) && (
                            <div className="space-y-10 border-l-2 border-slate-100 pl-8">
                                <div className="space-y-6">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                                        {language === 'mn' ? 'Navigacija' : 'Concierge'}
                                    </h4>

                                    <div className="space-y-4">
                                        {googleMapsUrl && (
                                            <a
                                                href={googleMapsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-5 group"
                                            >
                                                <div className="w-12 h-12 bg-slate-100 rounded-none flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors border border-slate-200">
                                                    <MapPin size={18} />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 border-b-2 border-transparent group-hover:border-montenegro-red transition-all">
                                                    {language === 'mn' ? 'Pronađi na mapi' : 'Get Directions'}
                                                </span>
                                            </a>
                                        )}

                                        {data.contactInfo?.website && (
                                            <a
                                                href={data.contactInfo.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-5 group"
                                            >
                                                <div className="w-12 h-12 bg-slate-100 rounded-none flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors border border-slate-200">
                                                    <Globe size={18} />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 border-b-2 border-transparent group-hover:border-montenegro-red transition-all">
                                                    {language === 'mn' ? 'Zvanični sajt' : 'Visit Website'}
                                                </span>
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Social & Contact */}
                                <div className="space-y-6">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                                        {language === 'mn' ? 'Kontakt' : 'Connect'}
                                    </h4>
                                    <div className="space-y-4">
                                        {data.contactInfo?.instagram && (
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded flex items-center justify-center">
                                                    <Instagram size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-slate-400">Instagram</p>
                                                    <p className="text-sm font-bold text-slate-900">{data.contactInfo.instagram}</p>
                                                </div>
                                            </div>
                                        )}

                                        {data.contactInfo?.phone && (
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded flex items-center justify-center">
                                                    <Phone size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-slate-400">Direct Call</p>
                                                    <p className="text-sm font-bold text-slate-900">{data.contactInfo.phone}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Features / Highlgihts */}
                                {data.features && data.features.length > 0 && (
                                    <div className="space-y-6">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Highlights</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {data.features.map(feature => (
                                                <span key={feature} className="text-[10px] font-black uppercase bg-slate-900 text-white px-4 py-2 rounded-none tracking-widest border border-slate-900 hover:bg-white hover:text-slate-900 transition-colors cursor-default">
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Author Bio Section */}
                        {data.author?.bio && (
                            <div className="pt-12 border-t border-slate-100 space-y-4">
                                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Curated by</h5>
                                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                    "{data.author.bio}"
                                </p>
                            </div>
                        )}
                    </aside>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="bg-slate-900 py-32 px-6 text-white text-center">
                <div className="max-w-xl mx-auto space-y-8">
                    <p className="text-montenegro-gold font-black uppercase tracking-[0.3em] text-xs">Ready for the next discovery?</p>
                    <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight">Explore more local favorites</h2>
                    <div className="pt-4">
                        <button
                            onClick={onBack}
                            className="px-12 py-5 bg-white text-slate-900 rounded-none font-black uppercase tracking-[0.3em] text-[10px] hover:bg-montenegro-red hover:text-white transition-all shadow-2xl"
                        >
                            {language === 'mn' ? 'Nazad na listu' : 'Return to Guides'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
