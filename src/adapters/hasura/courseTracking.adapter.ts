import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { SuccessResponse } from "src/success-response";
import { CourseTrackingDto } from "src/courseTracking/dto/courseTracking.dto";

@Injectable()
export class CourseTrackingService {
  constructor(private httpService: HttpService) {}
  public async getCourseTracking(courseTrackingId: any, request: any) {
    var axios = require("axios");

    var data = {
      query: `query GetCourseTracking($courseTrackingId:uuid) {
      coursetracking(where: {courseTrackingId: {_eq: $courseTrackingId}}) {
        contentIds
        certificate
        courseId
        courseTrackingId
        created_at
        endTime
        progressDetail
        startTime
        status
        updated_at
        userId
        date
        source
      }
    }`,
      variables: {
        courseTrackingId: courseTrackingId,
      },
    };

    var config = {
      method: "post",
      url: process.env.REGISTRYHASURA,
      headers: {
        "x-hasura-admin-secret": process.env.REGISTRYHASURAADMINSECRET,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios(config);

    let result = response.data.data.coursetracking.map(
      (item: any) => new CourseTrackingDto(item)
    );

    return new SuccessResponse({
      statusCode: 200,
      message: "Ok.",
      data: result,
    });
  }
  public async createCourseTracking(
    request: any,
    progressDetail: string,
    courseId: string,
    userId: string,
    contentIds: string,
    startTime: string,
    endTime: string,
    certificate: string,
    status: string,
    source: string
  ) {
    var axios = require("axios");
    var data = {
      query: `mutation CreateCourseTracking($contentIds: jsonb, $certificate: String, $courseId:String, $startTime: String, $endTime: String, $progressDetail: String, $status: String, $userId: String,$source:String) {
      insert_coursetracking_one(object:{contentIds: $contentIds, certificate: $certificate, courseId:$courseId, startTime: $startTime, endTime: $endTime, progressDetail: $progressDetail, status: $status, userId: $userId, source:$source}) {
        courseTrackingId
      }
    }`,
      variables: {
        contentIds: contentIds,
        certificate: certificate,
        courseId: courseId,
        endTime: endTime,
        progressDetail: progressDetail,
        startTime: startTime,
        status: status,
        userId: userId,
        source: source,
      },
    };

    var config = {
      method: "post",
      url: process.env.REGISTRYHASURA,
      headers: {
        "x-hasura-admin-secret": process.env.REGISTRYHASURAADMINSECRET,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios(config);

    return new SuccessResponse({
      statusCode: 200,
      message: "Ok.",
      data: response.data,
    });
  }

  public async updateCourseTracking(
    request: any,
    courseTrackingId: string,
    progressDetail: string,
    courseId: string,
    userId: string,
    contentIds: string,
    startTime: string,
    endTime: string,
    certificate: string,
    status: string,
    source: string
  ) {
    var axios = require("axios");

    const updateData = {
      contentIds: contentIds,
      certificate: certificate,
      courseId: courseId,
      endTime: endTime,
      progressDetail: progressDetail,
      startTime: startTime,
      status: status,
      userId: userId,
      source: source,
    };

    let newDataObject = "";
    const newData = Object.keys(updateData).forEach((e) => {
      if (updateData[e] && updateData[e] != "") {
        if (e != "contentIds") {
          newDataObject += `${e}: "${updateData[e]}", `;
        } else {
          newDataObject += `${e}: ${updateData[e]}, `;
        }
      }
    });

    var data = {
      query: `mutation CreateCourseTracking($courseTrackingId:uuid) {
        update_coursetracking(where: {courseTrackingId: {_eq: $courseTrackingId}}, _set: {${newDataObject}}) {
            affected_rows
      }
    }`,
      variables: {
        courseTrackingId: courseTrackingId,
      },
    };

    var config = {
      method: "post",
      url: process.env.REGISTRYHASURA,
      headers: {
        "x-hasura-admin-secret": process.env.REGISTRYHASURAADMINSECRET,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios(config);

    return new SuccessResponse({
      statusCode: 200,
      message: "Ok.",
      data: response.data,
    });
  }

  public async searchCourseTracking(
    limit: string,
    courseId: string,
    userId: string,
    status: string,
    page: number,
    source: string,
    request: any
  ) {
    var axios = require("axios");
    let offset = 0;

    if (page > 1) {
      offset = parseInt(limit) * (page - 1);
    }

    const searchData = {
      courseId,
      userId,
      status,
      source,
    };

    let newDataObject = "";
    const newData = Object.keys(searchData).forEach((e) => {
      if (searchData[e] && searchData[e] != "") {
        newDataObject += `${e}:{_eq:"${searchData[e]}"}`;
      }
    });

    var data = {
      query: `query searchCourseTracking($offset:Int,$limit:Int) {
  coursetracking(limit: $limit, offset: $offset, where: {${newDataObject}}) {
    contentIds
    certificate
    courseId
    courseTrackingId
    created_at
    endTime
    progressDetail
    startTime
    status
    updated_at
    userId
    date
    source
  }
}`,
      variables: {
        limit: parseInt(limit),
        offset: offset,
      },
    };

    var config = {
      method: "post",
      url: process.env.REGISTRYHASURA,
      headers: {
        "x-hasura-admin-secret": process.env.REGISTRYHASURAADMINSECRET,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios(config);
    let result = [];

    if (response?.data?.data?.coursetracking) {
      result = response.data.data.coursetracking.map(
        (item: any) => new CourseTrackingDto(item)
      );
    }

    return new SuccessResponse({
      statusCode: 200,
      message: "Ok.",
      data: result,
    });
  }
}
