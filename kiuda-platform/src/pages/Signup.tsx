import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { districtsByProvince, provinceOptions } from '@/data/regions'

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordNoUpperRegex = /^[^A-Z]+$/;
const passwordLowerRegex = /[a-z]/;
const passwordNumberRegex = /[0-9]/;
const passwordSpecialRegex = /[^A-Za-z0-9]/;

const stepTitles = [
  '이메일과 비밀번호를 입력해주세요',
  '프로필 정보를 완성해주세요',
  '약관에 동의하고 가입을 완료해주세요',
]

function checkPasswordStrength(pwd: string) {
  let strength = 0
  if (pwd.length >= 8) strength++
  if (/[a-z]/.test(pwd) && /[0-9]/.test(pwd)) strength++
  if (/[!@#$%^&*]/.test(pwd)) strength++
  return strength
}

/** 회원가입 화면 — 3단계 위저드 (원본 screens/signup.dc.html 1:1 대응) */
export default function Signup() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [currentStep, setCurrentStep] = useState(0)

  const goToHome = () => {
    const confirmed = window.confirm(
      '작성 중인 회원가입 정보가 초기화됩니다. 홈으로 이동하시겠습니까?')
    if (confirmed) {
      navigate('/')
    }
  }

  // Step 1
  const [email, setEmail] = useState('')
  const [emailChecked, setEmailChecked] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Step 2
  const [name, setName] = useState('')
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [selectedPlantTypes] = useState<string[]>([])

  // Step 3
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [marketingAgreed, setMarketingAgreed] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [signupError, setSignupError] = useState('')

  const passwordStrength = checkPasswordStrength(password)
  const passwordMatch = passwordConfirm.length > 0 && password === passwordConfirm

  const nextButtonEnabled1 = emailChecked && passwordMatch && !!password && password.length >= 8
  const step2ButtonEnabled = !!(name && province && district)
  const step3ButtonEnabled = termsAgreed && !isSigningUp

  const checkEmailDuplicate = async () => {
    if (!email) {
      setEmailError('이메일을 입력해주세요')
      return
    }
    if (!emailRegex.test(email)) {
      setEmailError('올바른 이메일 형식이 아닙니다')
      return
    }
    try {
      const response = await fetch(`/api/auth/checkEmail?email=${email}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      if (response.status===409) {
        setEmailError('이미 사용 중인 이메일입니다.')
        setEmailChecked(false)
      }
      else if(response.status===400) {
        setEmailError('이메일을 입력해주세요.')
        setEmailChecked(false)
      }
      else if (response.status===200) {
        setEmailChecked(true)
        setEmailError('')
      }
      else {
        setEmailError('서버 오류입니다. 다시 시도해주세요. 이 현상이 반복된다면 문의해주세요.')
        setEmailChecked(false)
      }
    } catch(err) {
      setEmailError(err instanceof Error ? err.message : '이메일 확인 중 오류가 발생했습니다.')
      setEmailChecked(false)
    }
  }

  const handleStep1 = (e: FormEvent) => {
    e.preventDefault()
    if (!emailRegex.test(email)) {
      alert('올바른 이메일 형식이 아닙니다.')
      return
    }
    if (password.length < 8) {
      alert('비밀번호는 8자 이상이어야 합니다.')
      return
    }
    if (!passwordNoUpperRegex.test(password)) {
      alert('비밀번호에는 대문자를 사용할 수 없습니다.')
      return
    }
    if (!passwordLowerRegex.test(password)) {
      alert('비밀번호에 소문자를 포함해야 합니다.')
      return
    }
    if (!passwordNumberRegex.test(password)) {
      alert('비밀번호에 숫자를 포함해야 합니다.')
      return
    }
    if (!passwordSpecialRegex.test(password)) {
      alert('비밀번호에 특수문자를 포함해야 합니다.')
      return
    }
    setCurrentStep(1)
  }

  const handleReset = () => {
    setCurrentStep(0)
    setEmail('')
    setEmailChecked(false)
    setEmailError('')
    setPassword('')
    setPasswordConfirm('')
    setShowPassword(false)
    setName('')
    setProvince('')
    setDistrict('')
    setTermsAgreed(false)
    setMarketingAgreed(false)
    setIsSigningUp(false)
    setSignupError('')
  }

  const handleStep2 = (e: FormEvent) => {
    e.preventDefault()
    if (step2ButtonEnabled) setCurrentStep(2)
  }

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault()
    setIsSigningUp(true)
    setSignupError('')

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name,
          province,
          district,
          plantInterests: selectedPlantTypes,
          marketingAgreed,
          termsAgreed
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: '회원가입 실패' }))
        throw new Error(err.message || '회원가입 실패')
      }

    const confirmed = window.confirm(
      '회원가입이 완료되었습니다. 로그인하시겠습니까?')
    if (confirmed) {
      navigate('/login')
    } else {
      navigate('/')
    }
    } catch(err) {  
      setSignupError(err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.')
    } finally {
      setIsSigningUp(false)
    }
  }

  const emailButtonLabel = emailChecked ? '✓ 확인' : '중복확인'
  const emailStatusText = emailError || (emailChecked ? '✓ 사용 가능한 이메일입니다' : '')
  const passwordStatusText = passwordConfirm ? (passwordMatch ? '✓ 비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다') : ''
  const signupButtonLabel = isSigningUp ? '회원가입 중...' : '회원가입 완료'
  const passwordStrengthLabel = passwordStrength === 0 ? '없음' : passwordStrength === 1 ? '약함' : passwordStrength === 2 ? '중간' : '강함'
  const passwordConfirmBorderColor = passwordConfirm && !passwordMatch ? '#FFB3B3' : passwordConfirm && passwordMatch ? '#56B968' : '#D9CFC1'
  const passwordMatchColor = passwordMatch ? '#4A7C4E' : '#C00'
  const step1ButtonBg = nextButtonEnabled1 ? '#56B968' : '#C8D8C5'
  const step2ButtonBg = step2ButtonEnabled ? '#56B968' : '#C8D8C5'
  const step3ButtonBg = step3ButtonEnabled ? '#56B968' : '#C8D8C5'
  const districtsForProvince = districtsByProvince[province] || []

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    border: '1.5px solid #D9CFC1',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  }
  const secondaryBtnStyle: React.CSSProperties = {
    flex: 1,
    padding: 12,
    background: 'white',
    border: '1.5px solid #D9CFC1',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    color: '#3D5A3D',
    transition: 'all 0.2s',
  }

  return (
    <div className="app-screen" style={{ background: 'linear-gradient(135deg, #F9F6EE 0%, #E8F3E3 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ animation: 'slideIn 0.6s ease-out', width: '100%', maxWidth: 480 }}>
          {/* Progress Indicator */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
            {[0, 1, 2].map((step) => (
              <div key={step} style={{ height: 4, flex: 1, borderRadius: 2, background: currentStep > step ? '#56B968' : '#E8E3D6', transition: 'background 0.3s' }} />
            ))}
          </div>

          {/* Logo & Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
              <button
                type='button'
                className='goToHome'
                onClick={goToHome}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#56B968', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: 'white' }}>
                  키
                </div>
              </button>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#3D5A3D', marginBottom: 8 }}>회원가입</h1>
            <p style={{ fontSize: 13, color: '#888' }}>{stepTitles[currentStep]}</p>
          </div>

          {/* Step 1: Email & Password */}
          {currentStep === 0 && (
            <form onSubmit={handleStep1} style={{ animation: 'fadeIn 0.3s ease-out'}}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#3D5A3D', marginBottom: 8 }}>이메일</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="email"
                    value={email}
                    placeholder="example@email.com"
                    className="kiuda-input"
                    style={{ ...inputStyle, flex: 1 }}
                    onInput={(e) => {
                      setEmail((e.target as HTMLInputElement).value)
                      setEmailChecked(false)
                      setEmailError('')
                    }}
                  />
                  <button
                    type="button"
                    onClick={checkEmailDuplicate}
                    className="kiuda-signup-secondary"
                    style={{ padding: '12px 20px', background: '#F5F0E8', border: '1.5px solid #D9CFC1', borderRadius: 8, fontSize: 12, fontWeight: 700, color: '#3D5A3D', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                  >
                    {emailButtonLabel}
                  </button>
                </div>
                {emailStatusText && (
                  <p style={{ fontSize: 12, color: emailError ? '#C00' : '#4A7C4E', marginTop: 6 }}>{emailStatusText}</p>
                )}
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#3D5A3D', marginBottom: 8 }}>비밀번호</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  placeholder="8자 이상, 소문자·숫자·특수문자를 포함 (대문자 불가)"
                  className="kiuda-input"
                  style={inputStyle}
                  onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  {[1, 2, 3].map((n) => (
                    <div key={n} style={{ flex: 1, height: 4, borderRadius: 2, background: passwordStrength >= n ? '#56B968' : '#E8E3D6' }} />
                  ))}
                </div>
                <p style={{ fontSize: 12, color: '#888', marginTop: 6 }}>강도: {passwordStrengthLabel}</p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#3D5A3D', marginBottom: 8 }}>비밀번호 확인</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordConfirm}
                  placeholder="비밀번호를 다시 입력하세요"
                  className="kiuda-input"
                  style={{ ...inputStyle, borderColor: passwordConfirmBorderColor }}
                  onInput={(e) => setPasswordConfirm((e.target as HTMLInputElement).value)}
                />
                {passwordConfirm && (
                  <p style={{ fontSize: 12, color: passwordMatchColor, marginTop: 6 }}>{passwordStatusText}</p>
                )}
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button type="button" onClick={handleReset} className="kiuda-signup-secondary" style={secondaryBtnStyle}>
                  초기화
                </button>
                <button
                  type="submit"
                  disabled={!nextButtonEnabled1}
                  className="kiuda-signup-primary"
                  style={{ flex: 1, padding: 12, background: step1ButtonBg, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, transition: 'background 0.2s' }}
                >
                  다음
                </button>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' ,marginBottom: 12}}>
                <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer'}} />
                <label style={{ fontSize: 12, color: '#888', cursor: 'pointer'}}>비밀번호 표시</label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20}}>
                <div style={{ flex: 1, height: 1, background: '#D9CFC1' }} />
                <span style={{ fontSize: 12, color: '#888', whiteSpace: 'nowrap' }}>또는</span>
                <div style={{ flex: 1, height: 1, background: '#D9CFC1' }} />
              </div>
            
              <div style={{ textAlign: 'center', marginBottom: 24}}>
                <p style={{ fontSize: 14, color: '#666' }}>
                  이미 계정이 있으신가요?{' '}
                  <Link to="/login" className="kiuda-link-hover" style={{ color: '#56B968', fontWeight: 700, textDecoration: 'none' }}>
                    로그인
                  </Link>
                </p>
              </div>
            </form>
          )}

          {/* Step 2: Profile Info */}
          {currentStep === 1 && (
            <form onSubmit={handleStep2} style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#3D5A3D', marginBottom: 8 }}>이름</label>
                <input
                  type="text"
                  value={name}
                  placeholder="실명 또는 별명"
                  className="kiuda-input"
                  style={inputStyle}
                  onInput={(e) => setName((e.target as HTMLInputElement).value)}
                />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#3D5A3D', marginBottom: 8 }}>지역</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <select
                    value={province}
                    onChange={(e) => {
                      setProvince(e.target.value)
                      setDistrict('')
                    }}
                    className="kiuda-input"
                    style={inputStyle}
                  >
                    <option value="">시/도 선택</option>
                    {provinceOptions.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    disabled={!province}
                    className="kiuda-input"
                    style={{ ...inputStyle, background: province ? 'white' : '#F5F0E8' }}
                  >
                    <option value="">시/군/구 선택</option>
                    {districtsForProvince.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 주로 기르는 것 선택 UI — 원본 목업에서도 display:none으로 숨김 처리된 기능 */}
              <div style={{ marginBottom: 24, display: 'none' }} />

              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => setCurrentStep((s) => s - 1)} className="kiuda-signup-secondary" style={secondaryBtnStyle}>
                  이전
                </button>
                <button
                  type="submit"
                  disabled={!step2ButtonEnabled}
                  className="kiuda-signup-primary"
                  style={{ flex: 1, padding: 12, background: step2ButtonBg, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, transition: 'background 0.2s' }}
                >
                  다음
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Terms & Completion */}
          {currentStep === 2 && (
            <form onSubmit={handleSignup} style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{ background: '#F5F0E8', borderRadius: 12, padding: 16, marginBottom: 20, maxHeight: 200, overflowY: 'auto' }}>
                <p style={{ fontSize: 12, color: '#555', lineHeight: 1.6 }}>
                  <strong style={{ color: '#3D5A3D' }}>키우다 이용약관 (요약)</strong>
                  <br />
                  <br />
                  1. 서비스 이용
                  <br />
                  본 서비스는 농작물·식물·과수의 생육 정보 제공 및 커뮤니티 연결을 위해 제공됩니다.
                  <br />
                  <br />
                  2. 개인정보 보호
                  <br />
                  귀하의 개인정보는 당사 개인정보처리방침에 따라 보호됩니다.
                  <br />
                  <br />
                  3. 금지 행위
                  <br />
                  스팸, 혐오, 저작권 침해 등의 행위는 금지됩니다.
                  <br />
                  <br />
                  4. 서비스 중단
                  <br />
                  당사는 필요 시 사전 공지 없이 서비스를 중단할 수 있습니다.
                  <br />
                  <br />
                  5. 책임 제한
                  <br />
                  본 서비스의 사용으로 인한 손해에 대해 당사는 책임을 지지 않습니다.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16, padding: 12, background: 'white', borderRadius: 8, border: '1.5px solid #D9CFC1' }}>
                <input type="checkbox" checked={termsAgreed} onChange={(e) => setTermsAgreed(e.target.checked)} style={{ width: 20, height: 20, marginTop: 2, cursor: 'pointer', flexShrink: 0 }} />
                <label style={{ fontSize: 13, color: '#3D5A3D', cursor: 'pointer', flex: 1 }}>
                  <strong>이용약관 및 개인정보 수집·이용</strong>에 동의합니다
                  <br />
                  <span style={{ color: '#888', fontSize: 12 }}> (필수)</span>
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 24, padding: 12, background: 'white', borderRadius: 8, border: '1.5px solid #D9CFC1' }}>
                <input type="checkbox" checked={marketingAgreed} onChange={(e) => setMarketingAgreed(e.target.checked)} style={{ width: 20, height: 20, marginTop: 2, cursor: 'pointer', flexShrink: 0 }} />
                <label style={{ fontSize: 13, color: '#3D5A3D', cursor: 'pointer', flex: 1 }}>
                  마케팅 정보 수신
                  <br />
                  <span style={{ color: '#888', fontSize: 12 }}> (선택) 팁, 뉴스레터 등을 받을 수 있습니다</span>
                </label>
              </div>

              {signupError && (
                <div style={{ background: '#FFE8E8', border: '1px solid #FFB3B3', borderRadius: 8, padding: '12px 14px', marginBottom: 16, fontSize: 13, color: '#C00', textAlign: 'center' }}>
                  {signupError}
                </div>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => setCurrentStep((s) => s - 1)} className="kiuda-signup-secondary" style={secondaryBtnStyle}>
                  이전
                </button>
                <button
                  type="submit"
                  disabled={!step3ButtonEnabled}
                  className="kiuda-signup-primary"
                  style={{ flex: 1, padding: 12, background: step3ButtonBg, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, transition: 'background 0.2s' }}
                >
                  {signupButtonLabel}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
