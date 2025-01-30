import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Collapse } from 'react-collapse';
import config from '../config';

const TGAreport = () => {
  const [appNames, setAppNames] = useState([]);
  const [branchNames, setBranchNames] = useState([]);
  const [searchTermApp, setSearchTermApp] = useState('');
  const [searchTermBranch, setSearchTermBranch] = useState('');
  const [filteredAppNames, setFilteredAppNames] = useState([]);
  const [filteredBranchNames, setFilteredBranchNames] = useState([]);
  const [selectedAppName, setSelectedAppName] = useState('');
  const [selectedBranchName, setSelectedBranchName] = useState('');
  const [isAppDropdownOpen, setIsAppDropdownOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [highlightedIndexApp, setHighlightedIndexApp] = useState(-1);
  const [highlightedIndexBranch, setHighlightedIndexBranch] = useState(-1);
  const [reportData, setReportData] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const appDropdownRef = useRef(null);
  const branchDropdownRef = useRef(null);
  const appSearchInputRef = useRef(null);
  const branchSearchInputRef = useRef(null);

  // Fetch app names
  useEffect(() => {
    setIsLoadingApps(true);
    axios
      .get('https://plutotv.sealights.co/sl-api/v1/apps', {
        headers: {
          Authorization: config.AUTH_TOKEN,
        },
      })
      .then((response) => {
        const apps = response.data.data.apps.map((app) => app.appName);
        setAppNames(apps);
        setFilteredAppNames(apps);
        setIsLoadingApps(false);
      })
      .catch((error) => {
        console.error('Error fetching app names:', error);
        setIsLoadingApps(false);
      });
  }, []);

  // Fetch branch names when an appName is selected
  useEffect(() => {
    if (selectedAppName) {
      setIsLoadingBranches(true);
      axios
        .get(
          `https://plutotv.sealights.co/sl-api/v1/apps/${selectedAppName}/branches`,
          {
            headers: {
              Authorization: config.AUTH_TOKEN,
            },
          }
        )
        .then((response) => {
          const branches = response.data.data.branches.map(
            (branch) => branch.branchName
          );
          setBranchNames(branches);
          setFilteredBranchNames(branches);
          setIsLoadingBranches(false);
        })
        .catch((error) => {
          console.error('Error fetching branch names:', error);
          setIsLoadingBranches(false);
        });
    }
  }, [selectedAppName]);

  // Fetch report data when both appName and branchName are selected
  useEffect(() => {
    if (selectedAppName && selectedBranchName) {
      setIsLoadingReports(true);
      axios
        .get(
          `https://plutotv.sealights.co/sl-api/v1/tga/report-templates/reports?appName=${selectedAppName}&branchName=${selectedBranchName}`,
          {
            headers: {
              Authorization: config.AUTH_TOKEN,
            },
          }
        )
        .then((response) => {
          setReportData(response.data.data);
          setIsLoadingReports(false);
        })
        .catch((error) => {
          console.error('Error fetching report data:', error);
          setIsLoadingReports(false);
        });
    }
  }, [selectedAppName, selectedBranchName]);

  const handleAppSelect = (appName) => {
    setSelectedAppName(appName);
    setIsAppDropdownOpen(false);
    setSearchTermApp('');
    setHighlightedIndexApp(-1);
  };

  const handleBranchSelect = (branchName) => {
    setSelectedBranchName(branchName);
    setIsBranchDropdownOpen(false);
    setSearchTermBranch('');
    setHighlightedIndexBranch(-1);
  };

  const handleKeyDownApp = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndexApp((prevIndex) =>
        prevIndex === filteredAppNames.length - 1 ? 0 : prevIndex + 1
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndexApp((prevIndex) =>
        prevIndex <= 0 ? filteredAppNames.length - 1 : prevIndex - 1
      );
    } else if (event.key === 'Enter' && highlightedIndexApp >= 0) {
      handleAppSelect(filteredAppNames[highlightedIndexApp]);
    }
  };

  const handleKeyDownBranch = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndexBranch((prevIndex) =>
        prevIndex === filteredBranchNames.length - 1 ? 0 : prevIndex + 1
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndexBranch((prevIndex) =>
        prevIndex <= 0 ? filteredBranchNames.length - 1 : prevIndex - 1
      );
    } else if (event.key === 'Enter' && highlightedIndexBranch >= 0) {
      handleBranchSelect(filteredBranchNames[highlightedIndexBranch]);
    }
  };

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const formatDateRange = (reportId) => {
    const [from, to] = reportId.split('-to-');
    const fromDate = new Date(
      from.substring(0, 4),
      from.substring(4, 6) - 1,
      from.substring(6, 8)
    );
    const toDate = new Date(
      to.substring(0, 4),
      to.substring(4, 6) - 1,
      to.substring(6, 8)
    );
    return `${fromDate.toLocaleDateString()} to ${toDate.toLocaleDateString()}`;
  };

  const handleClickOutside = (event) => {
    if (
      appDropdownRef.current &&
      !appDropdownRef.current.contains(event.target) &&
      branchDropdownRef.current &&
      !branchDropdownRef.current.contains(event.target)
    ) {
      setIsAppDropdownOpen(false);
      setIsBranchDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>TGA Reports Search</h1>
      <div className='relative inline-block w-64' ref={appDropdownRef}>
        <button
          onClick={() => {
            setIsAppDropdownOpen(!isAppDropdownOpen);
            if (!isAppDropdownOpen) {
              setTimeout(() => appSearchInputRef.current.focus(), 0);
            }
          }}
          className='bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-left w-full'
        >
          {selectedAppName || 'Select service name'}
        </button>
        {isAppDropdownOpen && (
          <div className='absolute bg-white border rounded-lg shadow-lg w-full mt-2 z-10'>
            <input
              type='text'
              placeholder='Search...'
              value={searchTermApp}
              onChange={(e) => {
                setSearchTermApp(e.target.value);
                setFilteredAppNames(
                  appNames.filter((name) =>
                    name.toLowerCase().includes(e.target.value.toLowerCase())
                  )
                );
              }}
              onKeyDown={handleKeyDownApp}
              className='w-full px-4 py-2 border-b focus:outline-none'
              ref={appSearchInputRef}
            />
            {isLoadingApps ? (
              <div className='flex justify-center py-2'>
                <div className='loader'></div>
              </div>
            ) : (
              <ul className='max-h-60 overflow-y-auto'>
                {filteredAppNames.map((appName, index) => (
                  <li
                    key={index}
                    onClick={() => handleAppSelect(appName)}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                      index === highlightedIndexApp ? 'bg-blue-200' : ''
                    }`}
                  >
                    {appName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      <div className='relative inline-block w-64 ml-4' ref={branchDropdownRef}>
        <button
          onClick={() => {
            if (selectedAppName) {
              setIsBranchDropdownOpen(!isBranchDropdownOpen);
              if (!isBranchDropdownOpen) {
                setTimeout(() => branchSearchInputRef.current.focus(), 0);
              }
            }
          }}
          className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-left w-full ${
            !selectedAppName ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!selectedAppName}
        >
          {selectedBranchName || 'Select branch name'}
          {isLoadingReports && <span className='loader ml-2'></span>}
        </button>
        {isBranchDropdownOpen && (
          <div className='absolute bg-white border rounded-lg shadow-lg w-full mt-2 z-10'>
            <input
              type='text'
              placeholder='Search...'
              value={searchTermBranch}
              onChange={(e) => {
                setSearchTermBranch(e.target.value);
                setFilteredBranchNames(
                  branchNames.filter((name) =>
                    name.toLowerCase().includes(e.target.value.toLowerCase())
                  )
                );
              }}
              onKeyDown={handleKeyDownBranch}
              className='w-full px-4 py-2 border-b focus:outline-none'
              ref={branchSearchInputRef}
            />
            {isLoadingBranches ? (
              <div className='flex justify-center py-2'>
                <div className='loader'></div>
              </div>
            ) : (
              <ul className='max-h-60 overflow-y-auto'>
                {filteredBranchNames.map((branchName, index) => (
                  <li
                    key={index}
                    onClick={() => handleBranchSelect(branchName)}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                      index === highlightedIndexBranch ? 'bg-blue-200' : ''
                    }`}
                  >
                    {branchName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Display report data */}
      {!selectedAppName && (
        <div className='mt-4 text-gray-500'>Select service name . . .</div>
      )}
      {selectedAppName && selectedBranchName && !reportData && (
        <div className='mt-4 text-gray-500'>
          No data available for this service.
        </div>
      )}
      {reportData && reportData.list.length === 0 && (
        <div className='mt-4 text-gray-500'>
          No data available for this service.
        </div>
      )}
      {reportData && reportData.list.length > 0 && (
        <div className='mt-4'>
          <h2 className='text-xl font-bold mb-2'>Report Data</h2>
          {reportData.list.map((report, index) => (
            <div key={index} className='mb-4 border rounded-lg shadow'>
              <button
                onClick={() => toggleAccordion(index)}
                className='w-full text-left px-4 py-2 bg-gray-200 hover:bg-gray-300 focus:outline-none'
              >
                Report: {formatDateRange(report.reportId)}
              </button>
              <Collapse isOpened={activeIndex === index}>
                <div className='p-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <h3 className='text-lg font-semibold text-blue-600'>
                        Report ID: {report.reportId}
                      </h3>
                      <p className='ml-4'>
                        <span className='font-medium'>Status:</span>{' '}
                        <span className='font-semibold'>{report.status}</span>
                      </p>
                      <p className='ml-4'>
                        <span className='font-medium'>Template ID:</span>{' '}
                        <span className='font-semibold'>
                          {report.templateId}
                        </span>
                      </p>
                      <p className='ml-4'>
                        <span className='font-medium'>App Name:</span>{' '}
                        <span className='font-semibold'>
                          {report.metadata.appName}
                        </span>
                      </p>
                      <p className='ml-4'>
                        <span className='font-medium'>Branch Name:</span>{' '}
                        <span className='font-semibold'>
                          {report.metadata.branchName}
                        </span>
                      </p>
                      <p className='ml-4'>
                        <span className='font-medium'>Report Source:</span>{' '}
                        <span className='font-semibold'>
                          {report.metadata.reportSource}
                        </span>
                      </p>
                      <p className='ml-4'>
                        <span className='font-medium'>Has Build In Range:</span>{' '}
                        <span className='font-semibold'>
                          {report.metadata.hasBuildInRange ? 'Yes' : 'No'}
                        </span>
                      </p>
                      <p className='ml-4'>
                        <span className='font-medium'>Code Labels:</span>{' '}
                        <span className='font-semibold'>
                          {report.metadata.codeLabels.join(', ') || 'None'}
                        </span>
                      </p>
                      <p className='ml-4'>
                        <span className='font-medium'>Range Dates:</span>{' '}
                        <span className='font-semibold'>
                          {new Date(
                            report.metadata.range.dates.from
                          ).toLocaleDateString()}{' '}
                          to{' '}
                          {new Date(
                            report.metadata.range.dates.to
                          ).toLocaleDateString()}
                        </span>
                      </p>
                      <p className='ml-4'>
                        <span className='font-medium'>Range Builds:</span>{' '}
                        <span className='font-semibold'>
                          {report.metadata.range.builds.from} to{' '}
                          {report.metadata.range.builds.to}
                        </span>
                      </p>
                    </div>
                    <div>
                      <h4 className='font-semibold mt-2 text-blue-600'>
                        Coverage:
                      </h4>
                      <h5 className='font-medium text-blue-500'>
                        Overall Coverage:
                      </h5>
                      <p className='ml-4'>
                        <span className='font-medium'>Total Methods:</span>{' '}
                        <span className='font-semibold'>
                          {
                            report.coverage.entireBuild.overallCoverage
                              .totalMethods
                          }
                        </span>
                      </p>
                      <p className='ml-4'>
                        <span className='font-medium'>Uncovered Methods:</span>{' '}
                        <span className='font-semibold'>
                          {
                            report.coverage.entireBuild.overallCoverage
                              .uncoveredMethods
                          }
                        </span>
                      </p>
                      <p className='ml-4'>
                        <span className='font-medium'>Covered Methods:</span>{' '}
                        <span className='font-semibold'>
                          {
                            report.coverage.entireBuild.overallCoverage
                              .coveredMethods
                          }
                        </span>
                      </p>
                      <p className='ml-4'>
                        <span className='font-medium'>Coverage:</span>{' '}
                        <span className='font-semibold'>
                          {report.coverage.entireBuild.overallCoverage.coverage}
                          %
                        </span>
                      </p>
                      <h5 className='font-medium text-blue-500'>
                        Modified Code Coverage:
                      </h5>
                      <p className='ml-4'>
                        <span className='font-medium'>Total Methods:</span>{' '}
                        <span className='font-semibold'>
                          {
                            report.coverage.entireBuild.modifiedCodeCoverage
                              .totalMethods
                          }
                        </span>
                      </p>
                      <p className='ml-4'>
                        <span className='font-medium'>Uncovered Methods:</span>{' '}
                        <span className='font-semibold'>
                          {
                            report.coverage.entireBuild.modifiedCodeCoverage
                              .uncoveredMethods
                          }
                        </span>
                      </p>
                      <p className='ml-4'>
                        <span className='font-medium'>Covered Methods:</span>{' '}
                        <span className='font-semibold'>
                          {
                            report.coverage.entireBuild.modifiedCodeCoverage
                              .coveredMethods
                          }
                        </span>
                      </p>
                      <p className='ml-4'>
                        <span className='font-medium'>Coverage:</span>{' '}
                        <span className='font-semibold'>
                          {
                            report.coverage.entireBuild.modifiedCodeCoverage
                              .coverage
                          }
                          %
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'>
                    {report.coverage.testStages.map((stage, stageIndex) => (
                      <div
                        key={stageIndex}
                        className='p-4 bg-gray-100 rounded-lg'
                      >
                        <h5 className='font-medium text-blue-600'>
                          {stage.name}
                        </h5>
                        <h6 className='font-medium text-blue-500'>
                          Overall Coverage:
                        </h6>
                        <p className='ml-4'>
                          <span className='font-medium'>Total Methods:</span>{' '}
                          <span className='font-semibold'>
                            {stage.overallCoverage.totalMethods}
                          </span>
                        </p>
                        <p className='ml-4'>
                          <span className='font-medium'>
                            Uncovered Methods:
                          </span>{' '}
                          <span className='font-semibold'>
                            {stage.overallCoverage.uncoveredMethods}
                          </span>
                        </p>
                        <p className='ml-4'>
                          <span className='font-medium'>Covered Methods:</span>{' '}
                          <span className='font-semibold'>
                            {stage.overallCoverage.coveredMethods}
                          </span>
                        </p>
                        <p className='ml-4'>
                          <span className='font-medium'>Coverage:</span>{' '}
                          <span className='font-semibold'>
                            {stage.overallCoverage.coverage}%
                          </span>
                        </p>
                        <h6 className='font-medium text-blue-500'>
                          Modified Code Coverage:
                        </h6>
                        <p className='ml-4'>
                          <span className='font-medium'>Total Methods:</span>{' '}
                          <span className='font-semibold'>
                            {stage.modifiedCodeCoverage.totalMethods}
                          </span>
                        </p>
                        <p className='ml-4'>
                          <span className='font-medium'>
                            Uncovered Methods:
                          </span>{' '}
                          <span className='font-semibold'>
                            {stage.modifiedCodeCoverage.uncoveredMethods}
                          </span>
                        </p>
                        <p className='ml-4'>
                          <span className='font-medium'>Covered Methods:</span>{' '}
                          <span className='font-semibold'>
                            {stage.modifiedCodeCoverage.coveredMethods}
                          </span>
                        </p>
                        <p className='ml-4'>
                          <span className='font-medium'>Coverage:</span>{' '}
                          <span className='font-semibold'>
                            {stage.modifiedCodeCoverage.coverage}%
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Collapse>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TGAreport;
