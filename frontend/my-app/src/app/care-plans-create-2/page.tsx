'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function CarePlanCreate2Page() {
  const [activeTab, setActiveTab] = useState('weekly')

  // Mock Data
  const summary = { total_activities: 42, participants: 4, daily_hours: 6 }
  const firstDayActivities = [
    { time: '07:00', title: '기상 도움', assignee: '간병인 김미숙' },
    { time: '07:30', title: '아침 식사 준비', assignee: '딸 박지은' },
    { time: '08:00', title: '약 복용 확인', assignee: '간병인 김미숙' },
    { time: '09:00', title: '가벼운 스트레칭', assignee: '간병인 김미숙' },
    { time: '10:00', title: '산책(날씨 좋을 시)', assignee: '딸 박지은' },
    { time: '12:00', title: '점심 식사 준비', assignee: '간병인 김미숙' }
  ]

  return (
    <div className="flex flex-col bg-white min-h-screen pb-20">
      <div className="self-stretch bg-white py-[40px] px-[34px]">
        {/* Header Card */}
        <div className="flex flex-col items-start self-stretch bg-white py-[17px] mb-9 gap-[18px] rounded-lg border border-solid border-[#18D4C6]"
          style={{
            boxShadow: "0px 1px 4px #00000040"
          }}>
          <div className="flex flex-col items-start ml-5 gap-1">
            <span className="text-[#353535] text-[28px] font-bold mr-[113px]" >
              케어 플랜
            </span>
            <span className="text-[#828282] text-base font-bold" >
              AI가 생성한 7일 간병 일정입니다.
            </span>
          </div>

          <div className="self-stretch h-[1px] mx-[19px] bg-gray-200 my-2" />

          <div className="flex items-start self-stretch mx-[42px] gap-4 justify-between">
            <div className="flex flex-1 flex-col items-center gap-0.5">
              <div className="flex flex-col items-center self-stretch text-left py-[18px] rounded-[50px] border-0"
                style={{
                  background: "linear-gradient(180deg, #F2FFFE, #FFF4F4)"
                }}>
                <span className="text-[#18D4C6] font-bold text-xl" >
                  {summary.total_activities}개
                </span>
              </div>
              <span className="text-[#828282] text-xs font-bold" >
                총 활동
              </span>
            </div>
            <div className="flex flex-1 flex-col items-center gap-0.5">
              <div className="flex flex-col items-center self-stretch text-left py-[18px] rounded-[50px] border-0"
                style={{
                  background: "linear-gradient(180deg, #F2FFFE, #FFF4F4)"
                }}>
                <span className="text-[#18D4C6] font-bold text-xl" >
                  {summary.participants}명
                </span>
              </div>
              <span className="text-[#828282] text-xs font-bold" >
                참여 인원
              </span>
            </div>
            <div className="flex flex-1 flex-col items-center gap-0.5">
              <div className="flex flex-col items-center self-stretch text-left py-[18px] rounded-[50px] border-0"
                style={{
                  background: "linear-gradient(180deg, #F2FFFE, #FFF4F4)"
                }}>
                <span className="text-[#18D4C6] font-bold text-xl" >
                  {summary.daily_hours}시간
                </span>
              </div>
              <span className="text-[#828282] text-xs font-bold" >
                일일 평균
              </span>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-start self-stretch mb-3 gap-2">
          <button
            className={`flex flex-1 flex-col items-center text-left py-3.5 rounded-lg border border-solid ${activeTab === 'weekly' ? 'bg-[#E8FFFD] border-[#18D4C6]' : 'bg-white border-[#828282]'}`}
            onClick={() => setActiveTab('weekly')}>
            <span className={`${activeTab === 'weekly' ? 'text-[#353535]' : 'text-[#828282]'} text-base font-bold`} >
              주간
            </span>
          </button>
          <button
            className={`flex flex-1 flex-col items-center text-left py-3.5 rounded-lg border border-solid ${activeTab === 'monthly' ? 'bg-[#E8FFFD] border-[#18D4C6]' : 'bg-white border-[#828282]'}`}
            onClick={() => setActiveTab('monthly')}>
            <span className={`${activeTab === 'monthly' ? 'text-[#353535]' : 'text-[#828282]'} text-base font-bold`} >
              월간
            </span>
          </button>
        </div>

        {/* Schedule List */}
        <div className="flex flex-col items-start self-stretch bg-white py-[19px] pr-[19px] mb-9 rounded-lg border border-gray-100"
          style={{
            boxShadow: "0px 1px 4px #00000040"
          }}>
          <span className="text-[#353535] text-base font-bold mb-[11px] ml-5" >
            월요일 일정
          </span>

          <div className="self-stretch h-[1px] mb-[17px] ml-[19px] bg-gray-100" />

          {firstDayActivities.map((activity: any, index: number) => (
            <div key={index} className="flex items-center self-stretch bg-[#F8F8F8] mb-2 ml-5 gap-[17px] rounded-[5px] overflow-hidden">
              <div className="bg-[#18D4C6] w-[5px] self-stretch">
              </div>
              <div className="flex shrink-0 items-center py-3">
                <span className="text-[#18D4C6] text-lg font-bold mr-[18px] w-[60px]" >
                  {activity.time}
                </span>
                <div className="flex flex-col shrink-0 items-start">
                  <span className="text-[#353535] text-base font-bold" >
                    {activity.title}
                  </span>
                  <span className="text-[#828282] text-xs" >
                    {activity.assignee}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Expert Review Section */}
        <div className="flex flex-col items-start self-stretch bg-white py-[19px] pr-5 rounded-lg border border-gray-100"
          style={{
            boxShadow: "0px 1px 4px #00000040"
          }}>
          <span className="text-[#353535] text-lg font-bold mb-3 ml-5" >
            전문가의 의견을 들어보세요
          </span>
          <span className="text-[#828282] text-sm mb-[15px] ml-5 whitespace-pre-wrap" >
            {"간병인님께 이 일정에 대한 검토를 요청하시겠어요?\n전문가의 현장 경험이 더해지면 더 실용적인 케어\n플랜이 됩니다."}
          </span>
          <div className="flex items-start self-stretch ml-5 gap-[9px]">
            <button className="flex flex-1 flex-col items-center bg-[#F2F2F2] text-left py-[11px] rounded-lg border border-solid border-[#828282]"
              onClick={() => alert("Pressed!")}>
              <span className="text-[#828282] text-base font-bold" >
                나중에 하기
              </span>
            </button>
            <button className="flex flex-1 flex-col items-center bg-[#18D4C6] text-left py-[11px] rounded-lg border border-solid border-[#18D4C6]"
              onClick={() => alert("Pressed!")}>
              <span className="text-white text-base font-bold" >
                요청하기
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
