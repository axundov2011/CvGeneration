import { useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik'
import './Forms.css'

const initialValues = {
  fullName: '',
  jobTitle: '',
  email: '',
  phone: '',
  city: '',
  birthDate: '',
  imageUrl: '',
  photoFile: null,
  about: '',
  experienceTitle: '',
  experienceCompany: '',
  experiencePeriod: '',
  experienceDetails: '',
  educationSchool: '',
  educationDegree: '',
  educationPeriod: '',
  skills: '',
  languages: '',
  cvFile: null,
}

const validate = (values) => {
  const errors = {}
  const nameRegex = /^[\p{L}\s]{3,60}$/u
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  const phoneRegex = /^\+?[0-9\s()-]{7,20}$/
  const urlRegex = /^https?:\/\/.+/i

  if (!nameRegex.test(values.fullName.trim())) {
    errors.fullName = 'Enter a valid full name.'
  }
  if (values.email && !emailRegex.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }
  if (values.phone && !phoneRegex.test(values.phone.trim())) {
    errors.phone = 'Enter a valid phone number.'
  }
  if (values.imageUrl && !urlRegex.test(values.imageUrl.trim())) {
    errors.imageUrl = 'Use a direct image URL starting with http:// or https://.'
  }

  return errors
}

const splitItems = (value) => value.split(',').map((item) => item.trim()).filter(Boolean)

const Forms = () => {
  const [cvs, setCvs] = useState([])
  const [selectedCv, setSelectedCv] = useState(null)
  const [brokenImageUrl, setBrokenImageUrl] = useState('')
  const [draftPhotoUrl, setDraftPhotoUrl] = useState('')
  const [downloadError, setDownloadError] = useState('')
  const photoInputRef = useRef(null)
  const cvFileInputRef = useRef(null)
  const cvDocumentRef = useRef(null)

  useEffect(() => () => {
    if (draftPhotoUrl) URL.revokeObjectURL(draftPhotoUrl)
  }, [draftPhotoUrl])

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: (values, { resetForm }) => {
      const newCv = {
        ...values,
        id: crypto.randomUUID(),
        fullName: values.fullName.trim(),
        photoUrl: draftPhotoUrl
          ? URL.createObjectURL(values.photoFile)
          : values.imageUrl.trim(),
        cvFileName: values.cvFile?.name || '',
        cvFileUrl: values.cvFile ? URL.createObjectURL(values.cvFile) : '',
      }

      setCvs((currentCvs) => [...currentCvs, newCv])
      setSelectedCv(newCv)
      resetForm()
      setDraftPhotoUrl('')
      if (photoInputRef.current) photoInputRef.current.value = ''
      if (cvFileInputRef.current) cvFileInputRef.current.value = ''
    },
  })

  const handleRemoveCv = (id) => {
    setCvs((currentCvs) => {
      const cvToRemove = currentCvs.find((cv) => cv.id === id)
      if (cvToRemove) {
        if (cvToRemove.photoUrl.startsWith('blob:')) URL.revokeObjectURL(cvToRemove.photoUrl)
        if (cvToRemove.cvFileUrl) URL.revokeObjectURL(cvToRemove.cvFileUrl)
      }
      return currentCvs.filter((cv) => cv.id !== id)
    })
    setSelectedCv((currentCv) => (currentCv?.id === id ? null : currentCv))
  }

  const handleShowCv = (cv) => {
    setSelectedCv(cv)
    if (cv.cvFileUrl) window.open(cv.cvFileUrl, '_blank', 'noopener,noreferrer')
  }

  const handleDownloadCv = async () => {
    if (!cvDocumentRef.current || !previewCv) return

    setDownloadError('')
    const fileName = `${(previewCv.fullName || 'CV')
      .trim()
      .replace(/[^\p{L}\p{N}-]+/gu, '-')
      .replace(/^-+|-+$/g, '') || 'CV'}-CV.pdf`

    try {
      const { default: html2pdf } = await import('html2pdf.js')
      await html2pdf()
        .set({
          margin: 10,
          filename: fileName,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
          },
          jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
          },
          pagebreak: { mode: ['css', 'legacy'] },
        })
        .from(cvDocumentRef.current)
        .save()
    } catch (error) {
      console.error('Unable to download CV as PDF:', error)
      setDownloadError('CV PDF could not be generated. Please try again.')
    }
  }

  const showError = (field) => formik.touched[field] && formik.errors[field]
  const previewCv = formik.dirty
    ? {
        ...formik.values,
        photoUrl: draftPhotoUrl || formik.values.imageUrl,
        cvFileName: formik.values.cvFile?.name || '',
      }
    : selectedCv

  const renderInput = (name, label, type = 'text', placeholder = label) => (
    <label className="cv-builder__field" key={name}>
      <span>{label}</span>
      <input
        className={showError(name) ? 'cv-builder__input cv-builder__input--error' : 'cv-builder__input'}
        type={type}
        name={name}
        placeholder={placeholder}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {showError(name) && <small className="cv-builder__error">{formik.errors[name]}</small>}
    </label>
  )

  const renderTextarea = (name, label, placeholder) => (
    <label className="cv-builder__field" key={name}>
      <span>{label}</span>
      <textarea
        className="cv-builder__textarea"
        name={name}
        placeholder={placeholder}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
    </label>
  )

  return (
    <main className="cv-page">
      <section className="cv-layout">
        <div className="cv-card">
          <div className="cv-card__header">
            <p className="cv-builder__eyebrow">PERSONAL WORKSPACE</p>
            <h1>Build your CV</h1>
            <p>Fill in your details and watch your resume take shape.</p>
          </div>

          <form className="cv-form" onSubmit={formik.handleSubmit} noValidate>
            <section className="cv-builder__section">
              <h2>Personal details</h2>
              <div className="cv-builder__fields">
                {renderInput('fullName', 'Full name')}
                {/* {renderInput('jobTitle', 'Professional title')} */}
                {renderInput('email', 'Email', 'email')}
                {renderInput('phone', 'Phone', 'tel')}
                {renderInput('city', 'Location')}
                {renderInput('birthDate', 'Date of birth', 'date')}
                {renderInput('imageUrl', 'Profile image URL', 'url', 'https://...')}
              </div>
              <label className="cv-builder__field cv-builder__photo-field">
                <span>Or choose a profile photo</span>
                <input
                  ref={photoInputRef}
                  className="cv-form__file"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.currentTarget.files[0] || null
                    setDraftPhotoUrl(file ? URL.createObjectURL(file) : '')
                    formik.setFieldValue('photoFile', file)
                  }}
                />
              </label>
            </section>

            <section className="cv-builder__section">
              <h2>Profile</h2>
              {renderTextarea('about', 'About you', 'Write a short professional introduction...')}
            </section>

            <section className="cv-builder__section">
              <h2>Work experience</h2>
              <div className="cv-builder__fields">
                {renderInput('experienceTitle', 'Position')}
                {renderInput('experienceCompany', 'Company')}
                {renderInput('experiencePeriod', 'Period', 'text', '2022 – Present')}
              </div>
              {renderTextarea('experienceDetails', 'Highlights', 'Describe your responsibilities and achievements...')}
            </section>

            <section className="cv-builder__section">
              <h2>Education</h2>
              <div className="cv-builder__fields">
                {renderInput('educationSchool', 'Institution')}
                {renderInput('educationDegree', 'Degree or field')}
                {renderInput('educationPeriod', 'Period', 'text', '2020 – 2024')}
              </div>
            </section>

            <section className="cv-builder__section">
              <h2>Skills and languages</h2>
              {renderInput('skills', 'Skills', 'text', 'React, CSS, Teamwork')}
              {renderInput('languages', 'Languages', 'text', 'Azerbaijani, English')}
            </section>

            <section className="cv-builder__section cv-builder__attachment">
              <h2>CV attachment <span>Optional</span></h2>
              <input
                className="cv-form__file"
                ref={cvFileInputRef}
                name="cvFile"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(event) => formik.setFieldValue('cvFile', event.currentTarget.files[0] || null)}
              />
              {formik.values.cvFile && (
                <p className="cv-form__file-preview">Selected: {formik.values.cvFile.name}</p>
              )}
            </section>

            <button className="cv-form__submit" type="submit">Save generated CV</button>
          </form>
        </div>

        <aside className="cv-preview">
          <div className="cv-preview__toolbar">
            <span>Live preview</span>
            <button
              className="cv-preview__download"
              type="button"
              onClick={handleDownloadCv}
              disabled={!previewCv}
              title="Download the CV preview as a PDF file"
            >
              Download PDF
            </button>
          </div>
          {downloadError && <p className="cv-preview__download-error" role="alert">{downloadError}</p>}
          {previewCv ? (
            <article className="cv-document" ref={cvDocumentRef}>
              <header className="cv-document__header">
                {previewCv.photoUrl && brokenImageUrl !== previewCv.photoUrl ? (
                  <img
                    key={previewCv.photoUrl}
                    src={previewCv.photoUrl}
                    alt={previewCv.fullName || 'Profile'}
                    className="cv-preview__image"
                    onError={() => setBrokenImageUrl(previewCv.photoUrl)}
                  />
                ) : (
                  <div className="cv-preview__avatar">
                    {previewCv.fullName?.trim()?.charAt(0) || '?'}
                  </div>
                )}
                <div className="cv-document__identity">
                  <h2>{previewCv.fullName || 'Your name'}</h2>
                  <p className="cv-document__role">{previewCv.jobTitle || 'Professional title'}</p>
                  <div className="cv-document__contacts">
                    {previewCv.email && <span>{previewCv.email}</span>}
                    {previewCv.phone && <span>{previewCv.phone}</span>}
                    {previewCv.city && <span>{previewCv.city}</span>}
                    {previewCv.birthDate && <span>{previewCv.birthDate}</span>}
                    {previewCv.profileUrl && <span>{previewCv.profileUrl}</span>}
                  </div>
                </div>
              </header>

              {previewCv.about && (
                <section className="cv-document__section">
                  <h3>Profile</h3>
                  <p>{previewCv.about}</p>
                </section>
              )}

              {(previewCv.experienceTitle || previewCv.experienceCompany || previewCv.experienceDetails) && (
                <section className="cv-document__section">
                  <h3>Experience</h3>
                  <div className="cv-document__entry">
                    <div className="cv-document__entry-heading">
                      <strong>{previewCv.experienceTitle || 'Position'}</strong>
                      <span>{previewCv.experiencePeriod}</span>
                    </div>
                    {previewCv.experienceCompany && <p className="cv-document__muted">{previewCv.experienceCompany}</p>}
                    {previewCv.experienceDetails && <p>{previewCv.experienceDetails}</p>}
                  </div>
                </section>
              )}

              {(previewCv.educationSchool || previewCv.educationDegree) && (
                <section className="cv-document__section">
                  <h3>Education</h3>
                  <div className="cv-document__entry-heading">
                    <strong>{previewCv.educationSchool || 'Institution'}</strong>
                    <span>{previewCv.educationPeriod}</span>
                  </div>
                  {previewCv.educationDegree && <p className="cv-document__muted">{previewCv.educationDegree}</p>}
                </section>
              )}

              {splitItems(previewCv.skills || '').length > 0 && (
                <section className="cv-document__section">
                  <h3>Skills</h3>
                  <div className="cv-document__tags">
                    {splitItems(previewCv.skills).map((skill) => <span key={skill}>{skill}</span>)}
                  </div>
                </section>
              )}

              {splitItems(previewCv.languages || '').length > 0 && (
                <section className="cv-document__section">
                  <h3>Languages</h3>
                  <p>{splitItems(previewCv.languages).join(' · ')}</p>
                </section>
              )}

              {previewCv.cvFileName && (
                <p className="cv-document__attachment">Attachment: {previewCv.cvFileName}</p>
              )}
            </article>
          ) : (
            <div className="cv-preview__empty">
              <span className="cv-preview__empty-mark">CV</span>
              <h2>Your resume preview</h2>
              <p>Start entering your information to build your CV.</p>
            </div>
          )}
        </aside>
      </section>

      <section className="cv-table-card">
        <h2>Created CVs</h2>
        <div className="cv-table-wrapper">
          <table className="cv-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>CV File</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cvs.length === 0 ? (
                <tr><td className="cv-table__empty" colSpan="5">No CVs created yet.</td></tr>
              ) : cvs.map((cv) => (
                <tr key={cv.id}>
                  <td>{cv.fullName}</td>
                  <td>{cv.email}</td>
                  <td>{cv.phone}</td>
                  <td>{cv.cvFileName || 'Generated CV'}</td>
                  <td className="cv-table__actions">
                    <button className="cv-table__show" type="button" onClick={() => handleShowCv(cv)}>Show CV</button>
                    <button className="cv-table__delete" type="button" onClick={() => handleRemoveCv(cv.id)}>Delete CV</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default Forms
