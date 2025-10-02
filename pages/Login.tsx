import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('chef.production@asment.ma');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Email ou mot de passe incorrect.');
    }
    setLoading(false);
  };

  const setCredentials = (email: string) => {
      setEmail(email);
      setPassword('demo123');
  }

  const logoSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAX8AAACDCAMAAABSveuDAAAAllBMVEX///8tKiYAqOIjIBsXEgsAAAC8vLolIR0iHhkUDgQqJyPBwL/e3t2CgX9tbGnc29oPCAA1My/Ly8o9Ozfm5eUJAAAdGBPx8fHk5OSjoqBCQD1QTkzT0tEAouBavul7ze5gX1ySkZDb7/np9Pun2PFVU09paGZ0c3GIh4W0s7OioaCamZiOjYtbWVZJR0M4NTG64fSC0O+Rmt5EAAANeklEQVR4nO2dfWOiuhLG4QIC8QVFDfXl7LF3T7XW1p77/b/clcwkmYToum1Rt+b5qyUkwI8wSSaTGAReXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl7tqDd7foqShL09z3rXvpcLa82jL1NSHL1MP4ZT+LyZVi44zxgLQ5ZmnO87KqE71UWXNEe1V3cd9+HIOHPdUbyuEx8S8c90S4uYiyL43rqQ67GMa3+x1lH4ZZoe5V+FDE5h0wc7acNTWgjjqwkmdXN1NOvTPL0psxKqOQsdigZ14sMUSn6fkMvuRYZ0YV3IoWGb/AfpqUv/noZH+S+H8hy+M1OqN24Xk71jOd1YHWNPFcm003lO808p/zAbkOsCf7awLuRQ/ufz72eKyNpM2WfNctIRVFSKZbokmVb6pn+Hfxh3VRF3xb9601dJjRb2UT45iziPJMNsFdhYsledqSD3/Fv8GVNf0V3xX5LnizskoZIJ8WKz2w320q7w0sYCoEBb+l4s/sxQZvIPuWpGTP5DnUVdUGn6x/N/ITY+XZEEacj5TlTMaofWiD8KLLRaptoALY7XfzaeU403daLmH2aSpcl/pLPIF6ALGlHT99W6CP89MQ5sTFrSQUQhHvQIL4CNBBbKn8/kOZMRKc7in7tYEf5sjlc3+BNVeC473pf+Ul2Cfy+kxpmTRvAJErimlsGRpP7b4M9CecqW9phs/i5bQfiH/BkvfYT/RPJvs9ITXYI/AsNqmz3rhx0DhJFuk9dwP0ldTc1mkffMUz7GP4wB7D3x34hrZDvJSD8sHiFt8msS13LxlwYooUd/mz+MuO6KPwDjJbau00ZtZ0yNiottp5ZwFUj+cJJsuOEoSz/IP8zFe7wj/ghsXnWAJ3RuhOS4jCWzoxnDdAOtdAJN52udh4376Qf5h3l9m3fEXwAL07egemf4l1ShbAmfPzZcn8ifdwBuLD4KKCTdzLiLf3wGf3H9W+G/msZfJrf/E5+0Nt/YD51qP1hf9WUYzwbbysiJ/PMCzBQ40woBiL9snfzZ20ZKOzokfzm4qm/lVviXna+ThQ/1AHW8fjnwJZCu/GEsRYdmcdynj438hz0YvzFWv7dnUUZSuet/yLTbWN8B+j/H+P5ZPLkZ/u0LoLO3w8spwQ2aEj9ksJnSwUE03evhgeRf4CvMu9KVxPbBEf5aDf7pukS40fqO+IOzMqs9AdjfZGPiiA+2Y07ZMb6SnSHFXzrrV0GwFNgPTfgH+K+CAbb3w25wL/wLRhpPbO3zLj2jepzHxpBqhI2o4i+/oXmFrqTDIOqY/UmlXPwn2ASw+cPiTvijsxI6j+hvizbmOdV2MSQfAUNfm+ZfwgRVLKvtYQjn5s/2KylNVvMPXnCmK9vcC/8nUbWxz6lawsZpk91+qqZCWSreluYfALbssRJOjHoSzc3/VP9fDODWaIFSfF/fnT8ACzOYdqzw+8+6jlPLQSbNEH+pDxD+0OthIfQ60/LD/B8MX+D359/h+JyD9Xo9WI+Q7855cilnI+EDIfy76JcWmFkdtPBB/sFWTUXfBf9nSRQaRfnYTCR2HoVe9azgAmsn9T+LYTU6T5li/lH+ygLdB3/DWamViB5of8hrJbo7WuJwjPo/Bf8NoSbm4j/Mv6IW6LvzXxpfuxYYePw4iD8iSI/wJyE6bFEnfpi/NIl3wf+xEd0DgiEwpsY6MG0SHeE/0QMsQP5x/vRb+u78MVInjTIpxJgTwGpSVlFlWRCY/ImjFkKBft//qfiTCeRvzn8C5j/V460iJFNeBRqVaI++566MVBNzlAb/UloymJs/Nv6NE0OrOtHmH3RVq/TN+SMkahUQFLwSGciWpqtZt5wt5NdhxP8A/0pWWozE+qX/R5RL439I5IuyQFfn//O/hn5ayT1TtoPZSm6UDo57FpKgW2xz2V4YIBWZlvI4Vi4IM/4Np3XkXBmamE/xx5mgG+D/4y9Df5upD2w6JLIjsYvYTLbnXx4gvsHwN0s7At/ExhX5x0J4kyZ/GfU2hHI+xV8Vdn3+/zFk8ccAESm7d1GMjOTG/CN2Go3RruzIYBjKuhn6ncowWZO/nMbHQNDP8ZcTb9+b/yATAZTJxHEwxZUYrzrsFh48nstiujnEX+L/G5GR4z3MYpHIFX+XZPw/XHFF7qKap+JYg38COdPvwH88EtobB2cMjsqwymI9iiMVMJvPd6qR6UbiPI7FbkXGhVlMCJ9RtR+5FEL8J4d/jND3Egp/sm55ws27a1ut8sdmeWLlgqOF4tzbblgIscf9LmniKzizMIqTTXllFt5za0KvaC69KRzH9LmNrkZLapX/76g66BPZ/1TdDP87led/XXn+15Xnf121yb86HS4nBrlH0sQIbEIOmG3zUidY/cTSKIE8SeMKZaPrY+T/Bv3PcngyWlREISbOtKEYMpQ6MTEmjKv3XCX0zWsu8Jp5ZB7v2BfK+fvTq9UzrodlMv/ofIafUZv8lydjq7mYdXGvPGdiWFTqRDNiqEcW1Jn8H6RjzQ6xcCwxZSkP7bD3pbpkcpne8LX5u1feNviHnFqLVz2BZfHXS1PJKoNa7iW+bPpsnKXCBeQMaes67f+8mfpP5yiDgCzntvjrlfEwhaZ0bIl1bn4BeqVmasXotaSflszU2+FPnWcF2TPE4k9yTI3pCMXfXmZtvKaljo1g0Q0Mxz/Z/uYxl5LnROoItL8SS+pqfwlNGjNNl3Ob/LskxTRAiv/7WEiFIhnr8WfkK8ldMXoX1uf4T2ZSW/TWh1F/qw6KsxFxuu5sqQQUyj/MNacFuarJn4ZbmDt9yKn+Ed7jcoUfkTE5QUu2g4Svoa8bf+GMdyM+IXZVVpTBX+M0lnOb/N/p/eS0ybb5BwGWQguoaLQYzJBeV1/P3/6o83P5h1wedq1/B2G/FK270WQ3+WNXhxaAvScZItPmvhvn6ab4SwP05lj/DoLlBewdp52pAWryf23yxyhr3N/DeU+XVfv8z7E/xoSxe/07CMIt+Etf2HZjmdM5/DE6Pu/itgjvJ9lcQjdR/xl2ytEAgZFg703+PTBMSYXNMO3BHOevm1kIVmXzCpOuH4N1E/z5DIsHHCIOiO3N9e9CW7nQHtsBgvYEf72xFpifg9nCFoa7FuVfVBezP9lzNZFSacg/X75B2L8wQBA+Hlnr34VwpeXhNIjk0lvWuPjLr0q10rhL2qFDWsGFU3ty/uK6WP0Ps6mUDvJC/sMe2nMRdw5Ggm+b/Cu9TQHuGBHp+1X8ZacUh1pML5Ms4Eg9bsYYMZ12JV2s/hOlDf4FeiVF4PPGuf69VkevtMREMraS41+2EUtunnFEnmbaxkMmNqrUNlxGD/Yaulz9P8m/grjc2lTDCqX0LWjyx6+kjuvClpiss1T+h5SGwcdPpIldaCuHZ1vOpcvrGvyjJn+0J/W6O9hK8VCxm/xxtxRR5+U2Zqoxcfs/6d3gqgDR6OI0AguvPAS+nP3R/repgz/2bA4dQhhi5UWTP25yCdvLYQOgezBO/mysl/6ZC8XRETRsvQf67z+G/jVTL1b/003ZlVJINH90zBzssaiY9fLJBv+dNt+HtgCyah+abX9w4y0eKS819J7QH/3YHBy3ozbnX6g+0f+vi4Wu4aEHJHqf9dxUgz/spYgBzXKZDVd7eUv+g77QCp1Iuo8Kd5jBjeC6QbFrS6u6VPzJJ/wPdbE4ImKwhVw9MLX5Y+B4tqsDGasJGhA1BG70P1/wyvHMuBjfivwFelKztg3QtfmfWf/ltgFQx5vr39X/OJAY4o0pA9Qcf63NAbScU+Yify4XQrU9BL42/zPrvzEzIro4Nv+N84cMlBO/yV9+UhAdX+2ZM39zp5Cv1bX5n1n/jT23xQaGFv9J6OSnJnwc/PEINBgkpMXgH7b8gyh/Cv+CTJk/Nde/H/0JC7lc6Vf8jy0U5y0Pga/N/1z7QyJLwA9n8Ufzo7ffw9NxtfAv+cudYFV+2YAMglZ1bf6y/99fGoIl15S//s0RCCxxrr9j476U3CU6MvbSOsa/x7BlV/nf8NFa9sHdCP/DkColymj8DxQ7UWfCwj2Tf4k7W+rPqJKWDXowv+CP/5BglEL2T9sNQ7k2f3dYWtrkrwwQOjVN/vh10O3/8QPAnc9+wR8LH5LhFremPdvRtfmfEf+GxcoWEjeQN/nTnw1AySithO4l1+x/hrXDocIZ+xXJv5FbbrU6BL42/zPib7FY3MtDBgwa/CdD+jJAS7lfAd1LnfCXLor6obqN+QLtsTj+q2ZfoWvzP7/+B3AvkpHBH+u62VmMaIBVkz+WdzBQldxbwggZlc/ergH68RfF39j/YWwsJ7d/Ca4wf27oVE1JoGGd2vynqUtcGOUSMiVo1F/ywz+RXP/+MhSJ8PuDa17/HYXGkpZ+DG15WPvgunChKNT32MlTeKpOkETWlq21FhzupdVZ4P/9MPSPmWrxd9R/4/Wc4L8aCK1sfxYet7QWdW4JiXI/4kL8J01MZw1n1t2bCksxIzZLec2eLmuwIa+ouxcvIN9i/rW5K+N2jXfjXKjk5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl1Y7+D3glW4AMUmvnAAAAAElFTkSuQmCC";
  
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col justify-center items-center relative">
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                     <img src={logoSrc} alt="Asment App Logo" className="w-32" />
                </div>
                <p className="text-slate-500 dark:text-slate-400">Connectez-vous à votre compte pour continuer</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2" htmlFor="email">
                            Adresse e-mail
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow-sm appearance-none border dark:border-slate-600 rounded w-full py-2 px-3 text-slate-700 dark:text-slate-200 dark:bg-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2" htmlFor="password">
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow-sm appearance-none border dark:border-slate-600 rounded w-full py-2 px-3 text-slate-700 dark:text-slate-200 dark:bg-slate-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline disabled:bg-primary-300"
                        >
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </div>
                </form>
            </div>
             <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
                <div className="flex justify-center space-x-2 mt-2">
                    <button onClick={() => setCredentials('chef.production@asment.ma')} className="text-primary-600 dark:text-primary-400 hover:underline">Chef</button>
                    <button onClick={() => setCredentials('ilyass.ait@asment.ma')} className="text-primary-600 dark:text-primary-400 hover:underline">Ingénieur</button>
                    <button onClick={() => setCredentials('ahmed.tech@asment.ma')} className="text-primary-600 dark:text-primary-400 hover:underline">Technicien</button>
                </div>
            </div>
        </div>
         <div className="absolute bottom-4 text-center text-xs text-slate-500 dark:text-slate-400 w-full">
            <p>&copy; {new Date().getFullYear()} Mizuchi. All rights reserved.</p>
            <a href="https://github.com/Mizuch1" target="_blank" rel="noopener noreferrer" className="hover:underline">
                GitHub: Mizuch1
            </a>
        </div>
    </div>
  );
};

export default Login;