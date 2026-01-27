import React from 'react';
import Carousel from './Carousel';
import BlogSection from './AllBlogs';

const Blog = () => {
    return (
        <div className="min-h-screen bg-gray-900">
            <Carousel/>
            <BlogSection/>
        </div>
    );
};

export default Blog;