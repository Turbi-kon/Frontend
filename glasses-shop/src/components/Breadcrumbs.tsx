import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface BreadcrumbsProps {
    paths: { label: string; url?: string }[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ paths }) => {
    return (
        <Breadcrumb>
            {paths.map((path, index) => (
                <Breadcrumb.Item key={index} linkAs={Link} linkProps={{ to: path.url || '#' }}>
                    {path.label}
                </Breadcrumb.Item>
            ))}
        </Breadcrumb>
    );
};

export default Breadcrumbs;