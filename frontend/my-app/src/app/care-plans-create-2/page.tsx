'use client'

import React from "react";

import { useRouter } from 'next/navigation'

export default function CarePlanCreate2Page(props: any) {
  const router = useRouter()

  return (
    <div className="flex flex-col bg-white">
      <div className="self-stretch bg-white py-[77px] px-[34px]"
        style={{
          boxShadow: "0px 4px 4px #00000040"
        }}>
        <div className="flex flex-col items-start self-stretch bg-white py-[17px] mb-9 gap-[18px] rounded-lg border border-solid border-[#18D4C6]"
          style={{
            boxShadow: "0px 1px 4px #00000040"
          }}>
          <div className="flex flex-col items-start ml-5 gap-1">
            <span className="text-[#353535] text-[28px] font-bold mr-[113px]" >
              {"케어 플랜"}
            </span>
            <span className="text-[#828282] text-base font-bold" >
              {"AI가 생성한 7일 간병 일정입니다."}
            </span>
          </div>
          <img
            src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dLEe2OFnnm/9qu8lziv_expires_30_days.png"}
            className="self-stretch h-[1px] mx-[19px] object-fill"
          />
          <div className="flex items-start self-stretch mx-[42px] gap-4">
            <div className="flex flex-1 flex-col items-center gap-0.5">
              <button className="flex flex-col items-center self-stretch text-left py-[18px] rounded-[50px] border-0"
                style={{
                  background: "linear-gradient(180deg, #F2FFFE, #FFF4F4)"
                }}
                onClick={() => alert("Pressed!")}>
                <span className="text-[#18D4C6] font-bold" >
                  {"42개"}
                </span>
              </button>
              <span className="text-[#828282] text-xs font-bold" >
                {"총 활동"}
              </span>
            </div>
            <div className="flex flex-1 flex-col items-center gap-0.5">
              <button className="flex flex-col items-center self-stretch text-left py-[18px] rounded-[50px] border-0"
                style={{
                  background: "linear-gradient(180deg, #F2FFFE, #FFF4F4)"
                }}
                onClick={() => alert("Pressed!")}>
                <span className="text-[#18D4C6] font-bold" >
                  {"4명"}
                </span>
              </button>
              <span className="text-[#828282] text-xs font-bold" >
                {"참여 인원"}
              </span>
            </div>
            <div className="flex flex-1 flex-col items-center gap-0.5">
              <button className="flex flex-col items-center self-stretch text-left py-[18px] rounded-[50px] border-0"
                style={{
                  background: "linear-gradient(180deg, #F2FFFE, #FFF4F4)"
                }}
                onClick={() => alert("Pressed!")}>
                <span className="text-[#18D4C6] font-bold" >
                  {"6시간"}
                </span>
              </button>
              <span className="text-[#828282] text-xs font-bold" >
                {"일일 평균"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-start self-stretch mb-3 gap-2">
          <button className="flex flex-1 flex-col items-center bg-[#E8FFFD] text-left py-3.5 rounded-lg border border-solid border-[#18D4C6]"
            onClick={() => alert("Pressed!")}>
            <span className="text-[#353535] text-base font-bold" >
              {"주간"}
            </span>
          </button>
          <button className="flex flex-1 flex-col items-center bg-white text-left py-3.5 rounded-lg border border-solid border-[#828282]"
            onClick={() => alert("Pressed!")}>
            <span className="text-[#828282] text-base font-bold" >
              {"월간"}
            </span>
          </button>
        </div>
        <div className="flex flex-col items-start self-stretch bg-white py-[19px] pr-[19px] mb-9 rounded-lg"
          style={{
            boxShadow: "0px 1px 4px #00000040"
          }}>
          <span className="text-[#353535] text-base font-bold mb-[11px] ml-5" >
            {"월요일 일정"}
          </span>
          <img
            src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dLEe2OFnnm/pdmjbxn4_expires_30_days.png"}
            className="self-stretch h-[1px] mb-[17px] ml-[19px] object-fill"
          />
          <div className="flex items-center self-stretch bg-[#F8F8F8] mb-2 ml-5 gap-[17px] rounded-[5px]">
            <div className="bg-[#18D4C6] w-[5px] h-[62px] rounded-tl-[5px] rounded-bl-[5px]">
            </div>
            <div className="flex shrink-0 items-center">
              <span className="text-[#18D4C6] text-lg font-bold mr-[18px]" >
                {"07:00"}
              </span>
              <div className="flex flex-col shrink-0 items-start mr-3">
                <span className="text-[#353535] text-base font-bold" >
                  {"기상 도움"}
                </span>
                <span className="text-[#828282] text-xs" >
                  {"간병인 김미숙"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center self-stretch bg-[#F8F8F8] mb-2 ml-5 gap-[17px] rounded-[5px]">
            <div className="bg-[#18D4C6] w-[5px] h-[62px] rounded-tl-[5px] rounded-bl-[5px]">
            </div>
            <div className="flex shrink-0 items-center gap-[19px]">
              <span className="text-[#18D4C6] text-lg font-bold" >
                {"07:30"}
              </span>
              <div className="flex flex-col shrink-0 items-start">
                <span className="text-[#353535] text-base font-bold" >
                  {"아침 식사 준비"}
                </span>
                <span className="text-[#828282] text-xs mr-11" >
                  {"딸 박지은"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center self-stretch bg-[#F8F8F8] mb-2 ml-5 gap-[17px] rounded-[5px]">
            <div className="bg-[#18D4C6] w-[5px] h-[62px] rounded-tl-[5px] rounded-bl-[5px]">
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <span className="text-[#18D4C6] text-lg font-bold" >
                {"08:00"}
              </span>
              <div className="flex flex-col shrink-0 items-start">
                <span className="text-[#353535] text-base font-bold" >
                  {"약 복용 확인"}
                </span>
                <span className="text-[#828282] text-xs" >
                  {"간병인 김미숙"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center self-stretch bg-[#F8F8F8] mb-2 ml-5 gap-[17px] rounded-[5px]">
            <div className="bg-[#18D4C6] w-[5px] h-[62px] rounded-tl-[5px] rounded-bl-[5px]">
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <span className="text-[#18D4C6] text-lg font-bold" >
                {"09:00"}
              </span>
              <div className="flex flex-col shrink-0 items-start">
                <span className="text-[#353535] text-base font-bold" >
                  {"가벼운 스트레칭"}
                </span>
                <span className="text-[#828282] text-xs mr-[33px]" >
                  {"간병인 김미숙"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center self-stretch bg-[#F8F8F8] mb-2 ml-5 gap-[17px] rounded-[5px]">
            <div className="bg-[#18D4C6] w-[5px] h-[62px] rounded-tl-[5px] rounded-bl-[5px]">
            </div>
            <div className="flex shrink-0 items-center gap-[19px]">
              <span className="text-[#18D4C6] text-lg font-bold" >
                {"10:00"}
              </span>
              <div className="flex flex-col shrink-0 items-start">
                <span className="text-[#353535] text-base font-bold" >
                  {"산책(날씨 좋을 시)"}
                </span>
                <span className="text-[#828282] text-xs mr-[71px]" >
                  {"딸 박지은"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center self-stretch bg-[#F8F8F8] ml-5 gap-[17px] rounded-[5px]">
            <div className="bg-[#18D4C6] w-[5px] h-[62px] rounded-tl-[5px] rounded-bl-[5px]">
            </div>
            <div className="flex shrink-0 items-center gap-[21px]">
              <span className="text-[#18D4C6] text-lg font-bold" >
                {"12:00"}
              </span>
              <div className="flex flex-col shrink-0 items-start">
                <span className="text-[#353535] text-base font-bold" >
                  {"점심 식사 준비"}
                </span>
                <span className="text-[#828282] text-xs mr-[23px]" >
                  {"간병인 김미숙"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start self-stretch bg-white py-[19px] pr-5 rounded-lg"
          style={{
            boxShadow: "0px 1px 4px #00000040"
          }}>
          <span className="text-[#353535] text-lg font-bold mb-3 ml-5" >
            {"전문가의 의견을 들어보세요"}
          </span>
          <span className="text-[#828282] text-sm mb-[15px] ml-5" >
            {"간병인님께 이 일정에 대한 검토를 요청하시겠어요?\n전문가의 현장 경험이 더해지면 더 실용적인 케어\n플랜이 됩니다."}
          </span>
          <div className="flex items-start self-stretch ml-5 gap-[9px]">
            <button className="flex flex-1 flex-col items-center bg-[#F2F2F2] text-left py-[11px] rounded-lg border border-solid border-[#828282]"
              onClick={() => router.push('/home')}>
              <span className="text-[#828282] text-base font-bold" >
                {"나중에 하기"}
              </span>
            </button>
            <button className="flex flex-1 flex-col items-center bg-[#18D4C6] text-left py-[11px] rounded-lg border border-solid border-[#18D4C6]"
              onClick={() => router.push('/care-plans-create-4')}>
              <span className="text-white text-base font-bold" >
                {"요청하기"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
