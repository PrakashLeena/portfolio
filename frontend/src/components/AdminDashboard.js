import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest, API_BASE_URL, createApiUrl } from '../config/api';

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: ''
  });
  
  // Active section state
  const [activeSection, setActiveSection] = useState('projects');
  
  // Form states
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    image: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Projects list state
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  
  // Experiences list state
  const [experiences, setExperiences] = useState([]);
  const [loadingExperiences, setLoadingExperiences] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    duration: '',
    description: '',
    skills: ''
  });
  
  // Skills list state
  const [skillsList, setSkillsList] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  
  const [newSkill, setNewSkill] = useState({
    category: '',
    skills: ''
  });
  
  // Certifications list state
  const [certifications, setCertifications] = useState([]);
  const [loadingCertifications, setLoadingCertifications] = useState(false);
  const [editingCertification, setEditingCertification] = useState(null);
  const [certImageFile, setCertImageFile] = useState(null);
  const [certImagePreview, setCertImagePreview] = useState(null);
  const [uploadingCertImage, setUploadingCertImage] = useState(false);
  
  const [newCertification, setNewCertification] = useState({
    title: '',
    issuer: '',
    date: '',
    credentialUrl: '',
    description: ''
  });

  // Resume state
  const [currentResume, setCurrentResume] = useState(null);
  const [loadingResume, setLoadingResume] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  // Profile Photo state
  const [currentProfilePhoto, setCurrentProfilePhoto] = useState(null);
  const [loadingProfilePhoto, setLoadingProfilePhoto] = useState(false);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState(false);

  useEffect(() => {
    // Check if admin is already logged in
    const adminStatus = localStorage.getItem('portfolioAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    } else {
      setShowAdminLogin(true);
    }
  }, []);

  // Fetch projects when projects section is active
  useEffect(() => {
    if (isAdmin && activeSection === 'projects') {
      fetchProjects();
    }
  }, [isAdmin, activeSection]);

  // Fetch experiences when experience section is active
  useEffect(() => {
    if (isAdmin && activeSection === 'experience') {
      fetchExperiences();
    }
  }, [isAdmin, activeSection]);

  // Fetch skills when skills section is active
  useEffect(() => {
    if (isAdmin && activeSection === 'skills') {
      fetchSkills();
    }
  }, [isAdmin, activeSection]);

  // Fetch certifications when certifications section is active
  useEffect(() => {
    if (isAdmin && activeSection === 'certifications') {
      fetchCertifications();
    }
  }, [isAdmin, activeSection]);

  // Fetch resume when resume section is active
  useEffect(() => {
    if (isAdmin && activeSection === 'resume') {
      fetchResume();
    }
  }, [isAdmin, activeSection]);

  // Fetch profile photo when profile-photo section is active
  useEffect(() => {
    if (isAdmin && activeSection === 'profile-photo') {
      fetchProfilePhoto();
    }
  }, [isAdmin, activeSection]);

  // Admin authentication
  const handleAdminLogin = async () => {
    const { username, password } = adminCredentials;
    
    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }

    try {
      console.log('🔐 Attempting admin login...');
      const result = await apiRequest('admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      
      if (result.success) {
        setIsAdmin(true);
        setShowAdminLogin(false);
        localStorage.setItem('portfolioAdmin', 'true');
        setAdminCredentials({ username: '', password: '' });
        console.log('✅ Admin logged in successfully');
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      // Fallback authentication
      const ADMIN_USERNAME = 'admin';
      const ADMIN_PASSWORD = 'portfolio2024';
      
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        setIsAdmin(true);
        setShowAdminLogin(false);
        localStorage.setItem('portfolioAdmin', 'true');
        setAdminCredentials({ username: '', password: '' });
        console.log('✅ Admin logged in successfully (offline mode)');
      } else {
        alert('Invalid credentials. Please try again.');
      }
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('portfolioAdmin');
    setShowAdminLogin(true);
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Save functions
  const handleSaveProject = async () => {
    if (!newProject.title || !newProject.description) {
      alert('Please fill in title and description');
      return;
    }

    try {
      let imageUrl = '';
      let imagePublicId = '';
      
      // Upload image if selected
      if (imageFile) {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append('image', imageFile);
        
        console.log('📸 Uploading image...');
        
        try {
          const uploadResponse = await fetch(createApiUrl('upload'), {
            method: 'POST',
            body: formData,
          });
          
          const uploadResult = await uploadResponse.json();
          
          if (uploadResult.success) {
            imageUrl = uploadResult.fileUrl;
            imagePublicId = uploadResult.publicId;
            console.log('✅ Image uploaded:', imageUrl);
          } else {
            setUploadingImage(false);
            throw new Error(uploadResult.message || 'Failed to upload image');
          }
          
          setUploadingImage(false);
        } catch (uploadError) {
          setUploadingImage(false);
          console.error('❌ Image upload error:', uploadError);
          alert('Failed to upload image: ' + uploadError.message);
          return; // Stop here if image upload fails
        }
      }
      
      console.log('💼 Adding new project:', newProject.title);
      const projectData = {
        ...newProject,
        image: imageUrl,
        imagePublicId: imagePublicId
      };
      
      const result = await apiRequest('projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
      });

      if (result.success) {
        console.log('✅ Project added successfully');
        console.log('📊 Project data:', result.data);
        alert('Project added successfully!');
        setNewProject({
          title: '',
          description: '',
          technologies: '',
          githubUrl: '',
          liveUrl: '',
          image: ''
        });
        setImageFile(null);
        setImagePreview(null);
        // Refresh projects list
        await fetchProjects();
      } else {
        console.error('❌ Failed to add project:', result.error);
        alert('Failed to add project: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Error saving project:', error);
      console.error('Error details:', error.message, error.stack);
      alert('Failed to save project: ' + error.message);
    }
  };

  // Fetch projects
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      console.log('📋 Fetching projects...');
      const result = await apiRequest('projects');
      
      if (result.success && result.data.projects) {
        console.log('✅ Projects fetched:', result.data.projects);
        setProjects(result.data.projects);
      }
    } catch (error) {
      console.error('❌ Error fetching projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  // Delete project
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      console.log('🗑️ Deleting project:', projectId);
      const result = await apiRequest(`projects/${projectId}`, {
        method: 'DELETE',
      });

      if (result.success) {
        console.log('✅ Project deleted successfully');
        alert('Project deleted successfully!');
        // Refresh projects list
        fetchProjects();
      } else {
        console.error('❌ Failed to delete project:', result.error);
        alert('Failed to delete project: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  // Fetch experiences
  const fetchExperiences = async () => {
    setLoadingExperiences(true);
    try {
      console.log('📋 Fetching experiences...');
      const result = await apiRequest('experiences');
      
      if (result.success && result.data.experiences) {
        console.log('✅ Experiences fetched:', result.data.experiences);
        setExperiences(result.data.experiences);
      }
    } catch (error) {
      console.error('❌ Error fetching experiences:', error);
    } finally {
      setLoadingExperiences(false);
    }
  };

  // Delete experience
  const handleDeleteExperience = async (experienceId) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) {
      return;
    }

    try {
      console.log('🗑️ Deleting experience:', experienceId);
      const result = await apiRequest(`experiences/${experienceId}`, {
        method: 'DELETE',
      });

      if (result.success) {
        console.log('✅ Experience deleted successfully');
        alert('Experience deleted successfully!');
        fetchExperiences();
      } else {
        console.error('❌ Failed to delete experience:', result.error);
        alert('Failed to delete experience: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
      alert('Failed to delete experience. Please try again.');
    }
  };

  // Edit experience
  const handleEditExperience = (experience) => {
    setEditingExperience(experience._id);
    setNewExperience({
      title: experience.title,
      company: experience.company,
      duration: experience.duration || '',
      description: experience.description || '',
      skills: experience.skills || ''
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update experience
  const handleUpdateExperience = async () => {
    if (!newExperience.title || !newExperience.company) {
      alert('Please fill in title and company');
      return;
    }

    try {
      console.log('✏️ Updating experience:', editingExperience);
      const result = await apiRequest(`experiences/${editingExperience}`, {
        method: 'PUT',
        body: JSON.stringify(newExperience),
      });

      if (result.success) {
        console.log('✅ Experience updated successfully');
        alert('Experience updated successfully!');
        setNewExperience({
          title: '',
          company: '',
          duration: '',
          description: '',
          skills: ''
        });
        setEditingExperience(null);
        fetchExperiences();
      } else {
        console.error('❌ Failed to update experience:', result.error);
        alert('Failed to update experience: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating experience:', error);
      alert('Failed to update experience. Please try again.');
    }
  };

  const handleSaveExperience = async () => {
    if (!newExperience.title || !newExperience.company) {
      alert('Please fill in title and company');
      return;
    }

    try {
      console.log('👨‍💻 Adding new experience:', newExperience.title, 'at', newExperience.company);
      const result = await apiRequest('experiences', {
        method: 'POST',
        body: JSON.stringify(newExperience),
      });

      if (result.success) {
        console.log('✅ Work experience added successfully');
        alert('Work experience added successfully!');
        setNewExperience({
          title: '',
          company: '',
          duration: '',
          description: '',
          skills: ''
        });
        fetchExperiences();
      } else {
        console.error('❌ Failed to add experience:', result.error);
        alert('Failed to add work experience: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Failed to save experience. Please try again.');
    }
  };

  // Fetch skills
  const fetchSkills = async () => {
    setLoadingSkills(true);
    try {
      console.log('📋 Fetching skills...');
      const result = await apiRequest('skills');
      
      if (result.success && result.data.skills) {
        console.log('✅ Skills fetched:', result.data.skills);
        setSkillsList(result.data.skills);
      }
    } catch (error) {
      console.error('❌ Error fetching skills:', error);
    } finally {
      setLoadingSkills(false);
    }
  };

  // Delete skill
  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm('Are you sure you want to delete this skill category?')) {
      return;
    }

    try {
      console.log('🗑️ Deleting skill:', skillId);
      const result = await apiRequest(`skills/${skillId}`, {
        method: 'DELETE',
      });

      if (result.success) {
        console.log('✅ Skill deleted successfully');
        alert('Skill deleted successfully!');
        fetchSkills();
      } else {
        console.error('❌ Failed to delete skill:', result.error);
        alert('Failed to delete skill: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Failed to delete skill. Please try again.');
    }
  };

  // Edit skill
  const handleEditSkill = (skill) => {
    setEditingSkill(skill._id);
    setNewSkill({
      category: skill.category,
      skills: skill.skills
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update skill
  const handleUpdateSkill = async () => {
    if (!newSkill.category || !newSkill.skills) {
      alert('Please fill in category and skills');
      return;
    }

    try {
      console.log('✏️ Updating skill:', editingSkill);
      const result = await apiRequest(`skills/${editingSkill}`, {
        method: 'PUT',
        body: JSON.stringify(newSkill),
      });

      if (result.success) {
        console.log('✅ Skill updated successfully');
        alert('Skill updated successfully!');
        setNewSkill({
          category: '',
          skills: ''
        });
        setEditingSkill(null);
        fetchSkills();
      } else {
        console.error('❌ Failed to update skill:', result.error);
        alert('Failed to update skill: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating skill:', error);
      alert('Failed to update skill. Please try again.');
    }
  };

  const handleSaveSkill = async () => {
    if (!newSkill.category || !newSkill.skills) {
      alert('Please fill in category and skills');
      return;
    }

    try {
      console.log('⚡ Adding new skill category:', newSkill.category);
      const result = await apiRequest('skills', {
        method: 'POST',
        body: JSON.stringify(newSkill),
      });

      if (result.success) {
        console.log('✅ Technical skill added successfully');
        alert('Technical skill added successfully!');
        setNewSkill({
          category: '',
          skills: ''
        });
        fetchSkills();
      } else {
        console.error('❌ Failed to add skill:', result.error);
        alert('Failed to add technical skill: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('Failed to save skill. Please try again.');
    }
  };

  // Handle certificate image change
  const handleCertImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setCertImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fetch certifications
  const fetchCertifications = async () => {
    setLoadingCertifications(true);
    try {
      console.log('📋 Fetching certifications...');
      const result = await apiRequest('certifications');
      
      if (result.success && result.data.certifications) {
        console.log('✅ Certifications fetched:', result.data.certifications);
        setCertifications(result.data.certifications);
      }
    } catch (error) {
      console.error('❌ Error fetching certifications:', error);
    } finally {
      setLoadingCertifications(false);
    }
  };

  // Delete certification
  const handleDeleteCertification = async (certificationId) => {
    if (!window.confirm('Are you sure you want to delete this certification?')) {
      return;
    }

    try {
      console.log('🗑️ Deleting certification:', certificationId);
      const result = await apiRequest(`certifications/${certificationId}`, {
        method: 'DELETE',
      });

      if (result.success) {
        console.log('✅ Certification deleted successfully');
        alert('Certification deleted successfully!');
        fetchCertifications();
      } else {
        console.error('❌ Failed to delete certification:', result.error);
        alert('Failed to delete certification: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting certification:', error);
      alert('Failed to delete certification. Please try again.');
    }
  };

  // Edit certification
  const handleEditCertification = (certification) => {
    setEditingCertification(certification._id);
    setNewCertification({
      title: certification.title,
      issuer: certification.issuer,
      date: certification.date || '',
      credentialUrl: certification.credentialUrl || '',
      description: certification.description || ''
    });
    if (certification.image) {
      setCertImagePreview(`${API_BASE_URL}${certification.image}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update certification
  const handleUpdateCertification = async () => {
    if (!newCertification.title || !newCertification.issuer) {
      alert('Please fill in title and issuer');
      return;
    }

    try {
      let imageUrl = '';
      
      // Upload new image if selected
      if (certImageFile) {
        setUploadingCertImage(true);
        const formData = new FormData();
        formData.append('image', certImageFile);
        
        console.log('📸 Uploading certificate image...');
        const uploadResponse = await fetch(createApiUrl('upload'), {
          method: 'POST',
          body: formData,
        });
        
        const uploadResult = await uploadResponse.json();
        
        if (uploadResult.success) {
          imageUrl = uploadResult.fileUrl;
          console.log('✅ Certificate image uploaded:', imageUrl);
        } else {
          throw new Error('Failed to upload certificate image');
        }
        
        setUploadingCertImage(false);
      }

      console.log('✏️ Updating certification:', editingCertification);
      const certificationData = {
        ...newCertification,
        ...(imageUrl && { image: imageUrl })
      };
      
      const result = await apiRequest(`certifications/${editingCertification}`, {
        method: 'PUT',
        body: JSON.stringify(certificationData),
      });

      if (result.success) {
        console.log('✅ Certification updated successfully');
        alert('Certification updated successfully!');
        setNewCertification({
          title: '',
          issuer: '',
          date: '',
          credentialUrl: '',
          description: ''
        });
        setCertImageFile(null);
        setCertImagePreview(null);
        setEditingCertification(null);
        fetchCertifications();
      } else {
        console.error('❌ Failed to update certification:', result.error);
        alert('Failed to update certification: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating certification:', error);
      alert('Failed to update certification. Please try again.');
      setUploadingCertImage(false);
    }
  };

  const handleSaveCertification = async () => {
    if (!newCertification.title || !newCertification.issuer) {
      alert('Please fill in title and issuer');
      return;
    }

    try {
      let imageUrl = '';
      
      // Upload image if selected
      if (certImageFile) {
        setUploadingCertImage(true);
        const formData = new FormData();
        formData.append('image', certImageFile);
        
        console.log('📸 Uploading certificate image...');
        const uploadResponse = await fetch(createApiUrl('upload'), {
          method: 'POST',
          body: formData,
        });
        
        const uploadResult = await uploadResponse.json();
        
        if (uploadResult.success) {
          imageUrl = uploadResult.fileUrl;
          console.log('✅ Certificate image uploaded:', imageUrl);
        } else {
          throw new Error('Failed to upload certificate image');
        }
        
        setUploadingCertImage(false);
      }

      console.log('🏆 Adding new certification:', newCertification.title, 'from', newCertification.issuer);
      const certificationData = {
        ...newCertification,
        image: imageUrl
      };
      
      const result = await apiRequest('certifications', {
        method: 'POST',
        body: JSON.stringify(certificationData),
      });

      if (result.success) {
        console.log('✅ Certification added successfully');
        alert('Certification added successfully!');
        setNewCertification({
          title: '',
          issuer: '',
          date: '',
          credentialUrl: '',
          description: ''
        });
        setCertImageFile(null);
        setCertImagePreview(null);
        fetchCertifications();
      } else {
        console.error('❌ Failed to add certification:', result.error);
        alert('Failed to add certification: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving certification:', error);
      alert('Failed to save certification. Please try again.');
    }
  };

  // Resume functions
  const fetchResume = async () => {
    setLoadingResume(true);
    try {
      console.log('📋 Fetching resume...');
      const result = await apiRequest('resume');
      
      if (result.success && result.data.resume) {
        console.log('✅ Resume fetched:', result.data.resume);
        setCurrentResume(result.data.resume);
      } else {
        setCurrentResume(null);
      }
    } catch (error) {
      console.error('❌ Error fetching resume:', error);
      setCurrentResume(null);
    } finally {
      setLoadingResume(false);
    }
  };

  const handleResumeFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file');
        return;
      }
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('Resume file size should be less than 10MB');
        return;
      }
      
      setResumeFile(file);
    }
  };

  const handleUploadResume = async () => {
    if (!resumeFile) {
      alert('Please select a resume file');
      return;
    }

    try {
      setUploadingResume(true);
      
      // Upload the PDF file
      const formData = new FormData();
      formData.append('resume', resumeFile);
      
      console.log('📄 Uploading resume file...');
      const uploadResponse = await fetch(createApiUrl('upload-resume'), {
        method: 'POST',
        body: formData,
      });
      
      const uploadResult = await uploadResponse.json();
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.message || 'Failed to upload resume file');
      }
      
      console.log('✅ Resume file uploaded:', uploadResult.fileUrl);
      
      // Save resume metadata to database
      const result = await apiRequest('resume', {
        method: 'POST',
        body: JSON.stringify({
          fileName: uploadResult.originalName,
          fileUrl: uploadResult.fileUrl
        }),
      });

      if (result.success) {
        console.log('✅ Resume saved successfully');
        alert('Resume uploaded successfully!');
        setResumeFile(null);
        // Clear file input
        const fileInput = document.querySelector('input[type="file"][accept=".pdf"]');
        if (fileInput) fileInput.value = '';
        fetchResume();
      } else {
        console.error('❌ Failed to save resume:', result.error);
        alert('Failed to save resume: ' + result.error);
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Failed to upload resume. Please try again.');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!currentResume) return;
    
    if (!window.confirm('Are you sure you want to delete the current resume?')) {
      return;
    }

    try {
      console.log('🗑️ Deleting resume:', currentResume._id);
      const result = await apiRequest(`resume/${currentResume._id}`, {
        method: 'DELETE',
      });

      if (result.success) {
        console.log('✅ Resume deleted successfully');
        alert('Resume deleted successfully!');
        setCurrentResume(null);
        fetchResume();
      } else {
        console.error('❌ Failed to delete resume:', result.error);
        alert('Failed to delete resume: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Failed to delete resume. Please try again.');
    }
  };

  // Profile Photo functions
  const fetchProfilePhoto = async () => {
    setLoadingProfilePhoto(true);
    try {
      console.log('📋 Fetching profile photo...');
      const result = await apiRequest('profile-photo');
      
      if (result.success && result.data.profilePhoto) {
        console.log('✅ Profile photo fetched:', result.data.profilePhoto);
        setCurrentProfilePhoto(result.data.profilePhoto);
      } else {
        setCurrentProfilePhoto(null);
      }
    } catch (error) {
      console.error('❌ Error fetching profile photo:', error);
      setCurrentProfilePhoto(null);
    } finally {
      setLoadingProfilePhoto(false);
    }
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setProfilePhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadProfilePhoto = async () => {
    if (!profilePhotoFile) {
      alert('Please select a profile photo');
      return;
    }

    try {
      setUploadingProfilePhoto(true);
      
      // Upload the image file
      const formData = new FormData();
      formData.append('image', profilePhotoFile);
      
      console.log('📸 Uploading profile photo...');
      const uploadResponse = await fetch(createApiUrl('upload'), {
        method: 'POST',
        body: formData,
      });
      
      const uploadResult = await uploadResponse.json();
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.message || 'Failed to upload profile photo');
      }
      
      console.log('✅ Profile photo uploaded:', uploadResult.fileUrl);
      
      // Save profile photo metadata to database
      const result = await apiRequest('profile-photo', {
        method: 'POST',
        body: JSON.stringify({
          imageUrl: uploadResult.fileUrl
        }),
      });

      if (result.success) {
        console.log('✅ Profile photo saved successfully');
        alert('Profile photo uploaded successfully!');
        setProfilePhotoFile(null);
        setProfilePhotoPreview(null);
        // Clear file input
        const fileInput = document.querySelector('input[type="file"][accept="image/*"]#profile-photo-input');
        if (fileInput) fileInput.value = '';
        fetchProfilePhoto();
      } else {
        console.error('❌ Failed to save profile photo:', result.error);
        alert('Failed to save profile photo: ' + result.error);
      }
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      alert('Failed to upload profile photo. Please try again.');
    } finally {
      setUploadingProfilePhoto(false);
    }
  };

  const handleDeleteProfilePhoto = async () => {
    if (!currentProfilePhoto) return;
    
    if (!window.confirm('Are you sure you want to delete the current profile photo?')) {
      return;
    }

    try {
      console.log('🗑️ Deleting profile photo:', currentProfilePhoto._id);
      const result = await apiRequest(`profile-photo/${currentProfilePhoto._id}`, {
        method: 'DELETE',
      });

      if (result.success) {
        console.log('✅ Profile photo deleted successfully');
        alert('Profile photo deleted successfully!');
        setCurrentProfilePhoto(null);
        fetchProfilePhoto();
      } else {
        console.error('❌ Failed to delete profile photo:', result.error);
        alert('Failed to delete profile photo: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting profile photo:', error);
      alert('Failed to delete profile photo. Please try again.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-4">
        {showAdminLogin && (
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white flex items-center justify-center space-x-2">
                <span>👑</span>
                <span>Admin Dashboard</span>
              </h2>
              <p className="text-white/60 mt-2">Login to access admin features</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">Username</label>
                <input
                  type="text"
                  value={adminCredentials.username}
                  onChange={(e) => setAdminCredentials({...adminCredentials, username: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Enter admin username"
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Password</label>
                <input
                  type="password"
                  value={adminCredentials.password}
                  onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Enter admin password"
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
              </div>

              <button
                onClick={handleAdminLogin}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                Login to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      {/* Header */}
      <header className="py-6 px-4 border-b border-white/10">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="text-purple-400 hover:text-purple-300 transition-colors mb-2 inline-block">
                ← Back to Portfolio
              </Link>
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-white/70 text-lg mt-2">
                Manage your portfolio content
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-green-400 text-sm flex items-center space-x-1">
                <span>👑</span>
                <span>Admin</span>
              </span>
              <button
                onClick={handleAdminLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sticky top-4">
              <h3 className="text-xl font-bold text-white mb-4">Sections</h3>
              <nav className="space-y-2">
                {[
                  { id: 'projects', label: 'Projects', icon: '💼' },
                  { id: 'experience', label: 'Work Experience', icon: '👨‍💻' },
                  { id: 'skills', label: 'Technical Skills', icon: '⚡' },
                  { id: 'certifications', label: 'Certifications', icon: '🏆' },
                  { id: 'resume', label: 'Resume', icon: '📄' },
                  { id: 'profile-photo', label: 'Profile Photo', icon: '📸' }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-3 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{section.icon}</span>
                    <span>{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
              
              {/* Projects Section */}
              {activeSection === 'projects' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                    <span>💼</span>
                    <span>Add New Project</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">Project Title</label>
                      <input
                        type="text"
                        value={newProject.title}
                        onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="Enter project title"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Technologies</label>
                      <input
                        type="text"
                        value={newProject.technologies}
                        onChange={(e) => setNewProject({...newProject, technologies: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="React, Node.js, MongoDB"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">GitHub URL</label>
                      <input
                        type="url"
                        value={newProject.githubUrl}
                        onChange={(e) => setNewProject({...newProject, githubUrl: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="https://github.com/username/repo"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Live URL</label>
                      <input
                        type="url"
                        value={newProject.liveUrl}
                        onChange={(e) => setNewProject({...newProject, liveUrl: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="https://project-demo.com"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-white font-semibold mb-2">Project Image</label>
                      <div className="space-y-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                        />
                        {imagePreview && (
                          <div className="relative">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-white/20"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImageFile(null);
                                setImagePreview(null);
                              }}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                        <p className="text-sm text-white/60">Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP</p>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-white font-semibold mb-2">Description</label>
                      <textarea
                        value={newProject.description}
                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                        rows="4"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="Describe your project..."
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveProject}
                    disabled={uploadingImage}
                    className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {uploadingImage ? '📸 Uploading Image...' : 'Add Project'}
                  </button>

                  {/* Manage Existing Projects */}
                  <div className="mt-12 pt-8 border-t border-white/10">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                        <span>📋</span>
                        <span>Manage Projects</span>
                      </h2>
                      <button
                        onClick={fetchProjects}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                      >
                        🔄 Refresh
                      </button>
                    </div>

                    {loadingProjects ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                        <p className="mt-2 text-white/70">Loading projects...</p>
                      </div>
                    ) : projects.length === 0 ? (
                      <div className="text-center py-8 bg-white/5 rounded-lg">
                        <p className="text-white/70">No projects found. Add your first project above!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {projects.map((project) => (
                          <div
                            key={project._id}
                            className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-start gap-4">
                                  {project.image && (
                                    <img
                                      src={`${API_BASE_URL}${project.image}`}
                                      alt={project.title}
                                      className="w-20 h-20 object-cover rounded-lg"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                      }}
                                    />
                                  )}
                                  <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-1">{project.title}</h3>
                                    <p className="text-sm text-white/70 mb-2 line-clamp-2">{project.description}</p>
                                    {project.technologies && (
                                      <div className="flex flex-wrap gap-2 mb-2">
                                        {project.technologies.split(',').map((tech, idx) => (
                                          <span
                                            key={idx}
                                            className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full"
                                          >
                                            {tech.trim()}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                    <div className="flex gap-3 text-xs text-white/50">
                                      {project.githubUrl && (
                                        <a
                                          href={project.githubUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="hover:text-white transition-colors"
                                        >
                                          🔗 GitHub
                                        </a>
                                      )}
                                      {project.liveUrl && (
                                        <a
                                          href={project.liveUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="hover:text-white transition-colors"
                                        >
                                          🌐 Live Demo
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteProject(project._id)}
                                className="px-4 py-2 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded-lg transition-all duration-300 font-medium"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Work Experience Section */}
              {activeSection === 'experience' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                    <span>👨‍💻</span>
                    <span>{editingExperience ? 'Edit Work Experience' : 'Add Work Experience'}</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">Job Title</label>
                      <input
                        type="text"
                        value={newExperience.title}
                        onChange={(e) => setNewExperience({...newExperience, title: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="Full Stack Developer"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Company</label>
                      <input
                        type="text"
                        value={newExperience.company}
                        onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="Company Name"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-white font-semibold mb-2">Duration</label>
                      <input
                        type="text"
                        value={newExperience.duration}
                        onChange={(e) => setNewExperience({...newExperience, duration: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="Jan 2023 - Present"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-white font-semibold mb-2">Skills Used</label>
                      <input
                        type="text"
                        value={newExperience.skills}
                        onChange={(e) => setNewExperience({...newExperience, skills: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="React, Node.js, MongoDB, etc."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-white font-semibold mb-2">Description</label>
                      <textarea
                        value={newExperience.description}
                        onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                        rows="4"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="Describe your role and achievements..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={editingExperience ? handleUpdateExperience : handleSaveExperience}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                    >
                      {editingExperience ? '✏️ Update Experience' : 'Add Experience'}
                    </button>
                    {editingExperience && (
                      <button
                        onClick={() => {
                          setEditingExperience(null);
                          setNewExperience({
                            title: '',
                            company: '',
                            duration: '',
                            description: '',
                            skills: ''
                          });
                        }}
                        className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-300"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {/* Manage Existing Experiences */}
                  <div className="mt-12 pt-8 border-t border-white/10">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                        <span>📋</span>
                        <span>Manage Experiences</span>
                      </h2>
                      <button
                        onClick={fetchExperiences}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                      >
                        🔄 Refresh
                      </button>
                    </div>

                    {loadingExperiences ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                        <p className="mt-2 text-white/70">Loading experiences...</p>
                      </div>
                    ) : experiences.length === 0 ? (
                      <div className="text-center py-8 bg-white/5 rounded-lg">
                        <p className="text-white/70">No experiences found. Add your first experience above!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {experiences.map((experience) => (
                          <div
                            key={experience._id}
                            className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-white mb-1">{experience.title}</h3>
                                <p className="text-sm text-purple-300 font-medium mb-1">{experience.company}</p>
                                {experience.duration && (
                                  <p className="text-xs text-white/60 mb-2">{experience.duration}</p>
                                )}
                                {experience.description && (
                                  <p className="text-sm text-white/70 mb-2 line-clamp-2">{experience.description}</p>
                                )}
                                {experience.skills && (
                                  <div className="mt-2">
                                    <span className="text-xs text-white/50">Skills: </span>
                                    <span className="text-xs text-white/70">{experience.skills}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditExperience(experience)}
                                  className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white rounded-lg transition-all duration-300 font-medium text-sm"
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteExperience(experience._id)}
                                  className="px-3 py-2 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded-lg transition-all duration-300 font-medium text-sm"
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Technical Skills Section */}
              {activeSection === 'skills' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                    <span>⚡</span>
                    <span>{editingSkill ? 'Edit Technical Skill' : 'Add Technical Skills'}</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">Category</label>
                      <input
                        type="text"
                        value={newSkill.category}
                        onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="e.g., Programming Languages, Frameworks, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Skills</label>
                      <input
                        type="text"
                        value={newSkill.skills}
                        onChange={(e) => setNewSkill({...newSkill, skills: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="React, Vue.js, Angular (comma separated)"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={editingSkill ? handleUpdateSkill : handleSaveSkill}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                    >
                      {editingSkill ? '✏️ Update Skill' : 'Add Skill'}
                    </button>
                    {editingSkill && (
                      <button
                        onClick={() => {
                          setEditingSkill(null);
                          setNewSkill({
                            category: '',
                            skills: ''
                          });
                        }}
                        className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-300"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {/* Manage Existing Skills */}
                  <div className="mt-12 pt-8 border-t border-white/10">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                        <span>📋</span>
                        <span>Manage Skills</span>
                      </h2>
                      <button
                        onClick={fetchSkills}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                      >
                        🔄 Refresh
                      </button>
                    </div>

                    {loadingSkills ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                        <p className="mt-2 text-white/70">Loading skills...</p>
                      </div>
                    ) : skillsList.length === 0 ? (
                      <div className="text-center py-8 bg-white/5 rounded-lg">
                        <p className="text-white/70">No skills found. Add your first skill above!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {skillsList.map((skill) => (
                          <div
                            key={skill._id}
                            className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-purple-300 mb-1">{skill.category}</h3>
                                <p className="text-sm text-white/70">{skill.skills}</p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditSkill(skill)}
                                  className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white rounded-lg transition-all duration-300 font-medium text-sm"
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteSkill(skill._id)}
                                  className="px-3 py-2 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded-lg transition-all duration-300 font-medium text-sm"
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Certifications Section */}
              {activeSection === 'certifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                    <span>🏆</span>
                    <span>{editingCertification ? 'Edit Certification' : 'Add Certification'}</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">Certification Title</label>
                      <input
                        type="text"
                        value={newCertification.title}
                        onChange={(e) => setNewCertification({...newCertification, title: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="AWS Certified Developer"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Issuer</label>
                      <input
                        type="text"
                        value={newCertification.issuer}
                        onChange={(e) => setNewCertification({...newCertification, issuer: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="Amazon Web Services"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Date</label>
                      <input
                        type="text"
                        value={newCertification.date}
                        onChange={(e) => setNewCertification({...newCertification, date: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="Dec 2024"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Credential URL</label>
                      <input
                        type="url"
                        value={newCertification.credentialUrl}
                        onChange={(e) => setNewCertification({...newCertification, credentialUrl: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="https://credential-url.com"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-white font-semibold mb-2">Certificate Image</label>
                      <div className="space-y-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCertImageChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                        />
                        {certImagePreview && (
                          <div className="relative">
                            <img 
                              src={certImagePreview} 
                              alt="Certificate Preview" 
                              className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-white/20"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setCertImageFile(null);
                                setCertImagePreview(null);
                              }}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                        <p className="text-sm text-white/60">Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP</p>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-white font-semibold mb-2">Description</label>
                      <textarea
                        value={newCertification.description}
                        onChange={(e) => setNewCertification({...newCertification, description: e.target.value})}
                        rows="3"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="Brief description of the certification..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={editingCertification ? handleUpdateCertification : handleSaveCertification}
                      disabled={uploadingCertImage}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {uploadingCertImage ? '📸 Uploading...' : editingCertification ? '✏️ Update Certification' : 'Add Certification'}
                    </button>
                    {editingCertification && (
                      <button
                        onClick={() => {
                          setEditingCertification(null);
                          setNewCertification({
                            title: '',
                            issuer: '',
                            date: '',
                            credentialUrl: '',
                            description: ''
                          });
                          setCertImageFile(null);
                          setCertImagePreview(null);
                        }}
                        className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-300"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {/* Manage Existing Certifications */}
                  <div className="mt-12 pt-8 border-t border-white/10">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                        <span>📋</span>
                        <span>Manage Certifications</span>
                      </h2>
                      <button
                        onClick={fetchCertifications}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                      >
                        🔄 Refresh
                      </button>
                    </div>

                    {loadingCertifications ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                        <p className="mt-2 text-white/70">Loading certifications...</p>
                      </div>
                    ) : certifications.length === 0 ? (
                      <div className="text-center py-8 bg-white/5 rounded-lg">
                        <p className="text-white/70">No certifications found. Add your first certification above!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {certifications.map((cert) => (
                          <div
                            key={cert._id}
                            className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-start gap-4">
                                  {cert.image && (
                                    <img
                                      src={`${API_BASE_URL}${cert.image}`}
                                      alt={cert.title}
                                      className="w-20 h-20 object-cover rounded-lg"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                      }}
                                    />
                                  )}
                                  <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-1">{cert.title}</h3>
                                    <p className="text-sm text-purple-300 font-medium mb-1">{cert.issuer}</p>
                                    {cert.date && (
                                      <p className="text-xs text-white/60 mb-2">{cert.date}</p>
                                    )}
                                    {cert.description && (
                                      <p className="text-sm text-white/70 mb-2 line-clamp-2">{cert.description}</p>
                                    )}
                                    {cert.credentialUrl && (
                                      <a
                                        href={cert.credentialUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                      >
                                        🔗 View Credential
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditCertification(cert)}
                                  className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white rounded-lg transition-all duration-300 font-medium text-sm"
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteCertification(cert._id)}
                                  className="px-3 py-2 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded-lg transition-all duration-300 font-medium text-sm"
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Resume Section */}
              {activeSection === 'resume' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                    <span>📄</span>
                    <span>Resume Management</span>
                  </h2>

                  {/* Current Resume Display */}
                  {loadingResume ? (
                    <div className="text-center py-8 bg-white/5 rounded-lg mb-6">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                      <p className="mt-2 text-white/70">Loading resume...</p>
                    </div>
                  ) : currentResume ? (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-2">Current Resume</h3>
                          <p className="text-white/70 mb-2">📎 {currentResume.fileName}</p>
                          <p className="text-xs text-white/50">
                            Uploaded: {new Date(currentResume.uploadedAt).toLocaleDateString()}
                          </p>
                          <div className="flex gap-3 mt-4">
                            <a
                              href={`${API_BASE_URL}${currentResume.fileUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white rounded-lg transition-all duration-300 font-medium text-sm"
                            >
                              👁️ View Resume
                            </a>
                            <a
                              href={`${API_BASE_URL}${currentResume.fileUrl}`}
                              download
                              className="px-4 py-2 bg-green-500/20 hover:bg-green-500 text-green-300 hover:text-white rounded-lg transition-all duration-300 font-medium text-sm"
                            >
                              ⬇️ Download
                            </a>
                            <button
                              onClick={handleDeleteResume}
                              className="px-4 py-2 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded-lg transition-all duration-300 font-medium text-sm"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-white/5 rounded-lg mb-6">
                      <p className="text-white/70">No resume uploaded yet</p>
                    </div>
                  )}

                  {/* Upload New Resume */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      {currentResume ? 'Replace Resume' : 'Upload Resume'}
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white font-semibold mb-2">Select PDF Resume</label>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleResumeFileChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                        />
                        <p className="text-sm text-white/60 mt-2">
                          Maximum file size: 10MB. Only PDF files are allowed.
                        </p>
                      </div>

                      {resumeFile && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                          <p className="text-green-300 text-sm">
                            ✅ Selected: {resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        </div>
                      )}

                      <button
                        onClick={handleUploadResume}
                        disabled={!resumeFile || uploadingResume}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {uploadingResume ? '📄 Uploading...' : currentResume ? '🔄 Replace Resume' : '📤 Upload Resume'}
                      </button>
                    </div>
                  </div>

                  {/* Information */}
                  <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="text-blue-300 font-semibold mb-2">ℹ️ Information</h4>
                    <ul className="text-sm text-blue-200/80 space-y-1">
                      <li>• Only one resume can be active at a time</li>
                      <li>• Uploading a new resume will replace the current one</li>
                      <li>• The resume will be available for download on your portfolio</li>
                      <li>• Supported format: PDF only</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Profile Photo Section */}
              {activeSection === 'profile-photo' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                    <span>📸</span>
                    <span>Profile Photo Management</span>
                  </h2>

                  {/* Current Profile Photo Display */}
                  {loadingProfilePhoto ? (
                    <div className="text-center py-8 bg-white/5 rounded-lg mb-6">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                      <p className="mt-2 text-white/70">Loading profile photo...</p>
                    </div>
                  ) : currentProfilePhoto ? (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
                      <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className="flex-shrink-0">
                          <img
                            src={currentProfilePhoto.imageUrl}
                            alt="Current Profile"
                            className="w-48 h-48 rounded-full object-cover border-4 border-purple-500/50"
                            onError={(e) => {
                              e.target.src = '/images/bg.png';
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-2">Current Profile Photo</h3>
                          <p className="text-xs text-white/50 mb-4">
                            Uploaded: {new Date(currentProfilePhoto.uploadedAt).toLocaleDateString()}
                          </p>
                          <div className="flex gap-3">
                            <a
                              href={currentProfilePhoto.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white rounded-lg transition-all duration-300 font-medium text-sm"
                            >
                              👁️ View Full Size
                            </a>
                            <button
                              onClick={handleDeleteProfilePhoto}
                              className="px-4 py-2 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded-lg transition-all duration-300 font-medium text-sm"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-white/5 rounded-lg mb-6">
                      <p className="text-white/70">No profile photo uploaded yet</p>
                    </div>
                  )}

                  {/* Upload New Profile Photo */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      {currentProfilePhoto ? 'Replace Profile Photo' : 'Upload Profile Photo'}
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white font-semibold mb-2">Select Profile Image</label>
                        <input
                          id="profile-photo-input"
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePhotoChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                        />
                        <p className="text-sm text-white/60 mt-2">
                          Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
                        </p>
                      </div>

                      {profilePhotoPreview && (
                        <div className="flex justify-center">
                          <div className="relative">
                            <img
                              src={profilePhotoPreview}
                              alt="Preview"
                              className="w-48 h-48 rounded-full object-cover border-4 border-purple-500/50"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setProfilePhotoFile(null);
                                setProfilePhotoPreview(null);
                                const fileInput = document.querySelector('#profile-photo-input');
                                if (fileInput) fileInput.value = '';
                              }}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleUploadProfilePhoto}
                        disabled={!profilePhotoFile || uploadingProfilePhoto}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {uploadingProfilePhoto ? '📸 Uploading...' : currentProfilePhoto ? '🔄 Replace Photo' : '📤 Upload Photo'}
                      </button>
                    </div>
                  </div>

                  {/* Information */}
                  <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="text-blue-300 font-semibold mb-2">ℹ️ Information</h4>
                    <ul className="text-sm text-blue-200/80 space-y-1">
                      <li>• Only one profile photo can be active at a time</li>
                      <li>• Uploading a new photo will replace the current one</li>
                      <li>• The photo will be displayed on your portfolio homepage</li>
                      <li>• Recommended: Square image for best results</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
