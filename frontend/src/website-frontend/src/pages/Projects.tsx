import React, { useMemo } from "react";
import { Navbar } from "../components/navbar/Navbar";
import ProjectsTab from "../components/projects/ProjectsTab";
import './Projects.css'
import { loadAssets } from "../utils/projects/loadAssets";
import { populatedProjectData } from "../utils/projects/populatedProjectData";

const Projects: React.FC = () => {
    const assets = useMemo(() => loadAssets(), []);

    const categories = [
      { key: 'open-source', heading: 'Open Source Projects' },
      { key: 'personal', heading: 'Personal Projects' },
      { key: 'school', heading: 'School Projects' },
    ];

    return (
      <>
        <div className="app-layout">
          <Navbar />
          <div className="content">
            {categories.map(cat => {
              const list = populatedProjectData.filter(p => (p.category ?? 'personal') === cat.key);
              if (!list.length) {
                return null;
              }
              return (
                <React.Fragment key={cat.key}>
                  <h1 className="project-headings">{cat.heading}</h1>
                  {list.map(p => (
                    <ProjectsTab
                      key={p.name} // or p.id if you add one
                      title={p.name}
                      summary={p.summary}
                      tags={p.tags}
                      imgs={assets[p.assetKey]}
                      git_link={p.gitHubLink}
                    />
                  ))}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </>
    );
};

export default Projects;